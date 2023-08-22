const { v4: uuidv4 } = require("uuid");
const createError = require("http-errors");
const commonHelper = require("../helper/common");
// const Joi = require("joi");
const cloudinary = require("../middlewares/cloudinary");
const {
    selectAllPortofolio,
    selectPortofolioById,
    selectPortofolioByPekerjaId,
    insertPortofolio,
    updatePortofolio,
    deletePortofolio,
    deletePortofolioByPekerjaId,
    countData,
    findUUID,
    findPekerjaId,
} = require("../model/portofolio");

const portofolioController = {
    getAllPortofolio: async (req, res) => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 100;
            const offset = (page - 1) * limit;
            const sortby = req.query.sortby || "portofolio_id";
            const sort = req.query.sort || "ASC";
            const result = await selectAllPortofolio({ limit, offset, sort, sortby });
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

    getPortofolioById: (req, res, next) => {
        const portofolio_id = String(req.params.id);
        selectPortofolioById(portofolio_id)
            .then((result) =>
                commonHelper.response(res, result.rows, 200, "get data success")
            )
            .catch((err) => res.send(err));
    },

    getPortofolioByPekerjaId: (req, res, next) => {
        const pekerja_id = String(req.params.pekerja_id);
        selectPortofolioByPekerjaId(pekerja_id)
            .then((result) =>
                commonHelper.response(res, result.rows, 200, "get data success")
            )
            .catch((err) => res.send(err));
    },

    insertPortofolio: async (req, res) => {
        const {
            // portofolio_image,
            portofolio_name,
            link_repository,
            pekerja_id } = req.body;
        const portofolio_id = uuidv4();
        let portofolio_image = null;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            portofolio_image = result.secure_url;
        }
        const data = {
            portofolio_id,
            portofolio_name,
            link_repository,
            portofolio_image,
            pekerja_id
        };
        insertPortofolio(data)
            .then((result) =>
                commonHelper.response(res, result.rows, 201, "Portofolio Berhasil ditambahkan")
            )
            .catch((err) => res.send(err));
    },

    updatePortofolio: async (req, res) => {
        try {
            const { portofolio_name,link_repository,pekerja_id } = req.body;
            const portofolio_id = String(req.params.id);
            const { rowCount } = await findUUID(portofolio_id);
            if (!rowCount) {
                return next(createError(403, "ID is Not Found"));
            }
            let portofolio_image = null;
            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path);
                portofolio_image = result.secure_url;
            }

            const data = {
                portofolio_id, portofolio_name,
                link_repository,
                portofolio_image,
                pekerja_id
            };
            updatePortofolio(data)
                .then((result) =>
                    commonHelper.response(res, result.rows, 200, "Portofolio berhasil diupdate")
                )
                .catch((err) => res.send(err));
        } catch (error) {
            console.log(error);
        }
    },
    deletePortofolio: async (req, res, next) => {
        try {
            const portofolio_id = String(req.params.id);
            const { rowCount } = await findUUID(portofolio_id);
            if (!rowCount) {
                return next(createError(403, "ID is Not Found"));
            }
            await deletePortofolio(portofolio_id);
            commonHelper.response(res, {}, 200, "Portofolio terhapus");
        } catch (error) {
            next(error);
        }
    },
    deletePortofolioByPekerjaId: async (req, res, next) => {
        try {
            const pekerja_id = String(req.params.pekerja_id);
            const portofolio_id = String(req.params.portofolio_id);
            await deletePortofolioByPekerjaId(pekerja_id, portofolio_id);
            commonHelper.response(res, {}, 200, "Portofolio terhapus");
        } catch (error) {
            next(error);
        }
    },
};

module.exports = portofolioController;