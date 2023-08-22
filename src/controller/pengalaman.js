const { v4: uuidv4 } = require("uuid");
const createError = require("http-errors");
const commonHelper = require("../helper/common");
const Joi = require("joi");
// const cloudinary = require("../middlewares/cloudinary");
const {
  selectAllPengalaman,
  selectPengalamanById,
  selectPengalamanByPekerjaId,
  insertPengalaman,
  updatePengalaman,
  deletePengalaman,
  deletePengalamanByPekerjaId,
  countData,
  findUUID,
  findPekerjaId,
} = require("../model/pengalaman");

const pengalamanController = {
  getAllPengalaman: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "pengalaman_kerja_id";
      const sort = req.query.sort || "ASC";
      const result = await selectAllPengalaman({ limit, offset, sort, sortby });
      const {
        rows: [count],
      } = await countData();
      const totalData = parseInt(count.count);
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        currentPage: page,
        limit: limit,
        totalData: totalData,
        totalPage: totalPage,
      };

      commonHelper.response(
        res,
        result.rows,
        200,
        "get data success",
        pagination
      );
    } catch (error) {
      console.log(error);
    }
  },

  getPengalalamanById: (req, res, next) => {
    const pengalaman_kerja_id = String(req.params.id);
    selectPengalamanById(pengalaman_kerja_id)
      .then((result) =>
        commonHelper.response(res, result.rows, 200, "get data success")
      )
      .catch((err) => res.send(err));
  },

  getPengalamanByPekerjaId: (req, res, next) => {
    const pekerja_id = String(req.params.pekerja_id);
    selectPengalamanByPekerjaId(pekerja_id)
      .then((result) =>
        commonHelper.response(res, result.rows, 200, "get data success")
      )
      .catch((err) => res.send(err));
  },

  insertPengalaman: async (req, res) => {
    const { 
        posisi,
        nama_perusahaan,
        dari,
        sampai,
        deskripsi, 
        pekerja_id} = req.body;
    const pengalaman_kerja_id = uuidv4();
    const data = {
        pengalaman_kerja_id, 
        posisi,
        nama_perusahaan,
        dari,
        sampai,
        deskripsi, 
        pekerja_id
      };
    insertPengalaman(data)
      .then((result) =>
        commonHelper.response(res, result.rows, 201, "Pengalaman Kerja Berhasil ditambahkan")
      )
      .catch((err) => res.send(err));
  },

  updatePengalaman: async (req, res) => {
    try {
      const { posisi,nama_perusahaan,dari,sampai,deskripsi } = req.body;
      const pengalaman_kerja_id = String(req.params.id);
      const { rowCount } = await findUUID(pengalaman_kerja_id);
      if (!rowCount) {
        return next(createError(403, "ID is Not Found"));
      }

      const data = {pengalaman_kerja_id, posisi,nama_perusahaan,dari,sampai,deskripsi};
      updatePengalaman(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Pengalaman kerja berhasil diupdate")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
  deletePengalaman: async (req, res, next) => {
    try {
      const pengalaman_kerja_id = String(req.params.id);
      const { rowCount } = await findUUID(pengalaman_kerja_id);
      if (!rowCount) {
        return next(createError(403, "ID is Not Found"));
      }
      await deletePengalaman(pengalaman_kerja_id);
      commonHelper.response(res, {}, 200, "Pengalaman kerja terhapus");
    } catch (error) {
      next(error);
    }
  },
  deletePengalamanByPekerjaId: async (req, res, next) => {
    try {
      const pekerja_id = String(req.params.pekerja_id);
      const pengalaman_kerja_id = String(req.params.pengalaman_kerja_id);
      await deletePengalamanByPekerjaId(pekerja_id,pengalaman_kerja_id);
      commonHelper.response(res, {}, 200, "Pengalaman kerja terhapus");
    } catch (error) {
      next(error);
    }
  },
};

module.exports = pengalamanController;