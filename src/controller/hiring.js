const { v4: uuidv4 } = require("uuid");
const commonHelper = require("../helper/common");
let {
  selectAllHiring,
  selectHiringPekerja,
  selectHiringPerekrut,
  deleteHiring,
  createHiring,
  findUUID,
  countData,
} = require("../model/hiring");
const sendemailhiring = require("../middlewares/sendemailhiring");

let hiringController = {
  getAllHiring: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "hiring_id";
      const sort = req.query.sort || "ASC";
      let result = await selectAllHiring({ limit, offset, sort, sortby });
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
        "Get hiring Data Success",
        pagination
      );
    } catch (err) {
      console.log(err);
    }
  },

  getSelectHiringPekerja: async (req, res) => {
    const pekerja_id = String(req.params.id);
    selectHiringPekerja(pekerja_id)
      .then((result) => {
        commonHelper.response(res, result.rows, 200, "Get hiring Detail Success");
      })
      .catch((err) => res.send(err));
  },

  getSelectHiringPerekrut: async (req, res) => {
    const perekrut_id = String(req.params.id);
    selectHiringPerekrut(perekrut_id)
      .then((result) => {
        commonHelper.response(res, result.rows, 200, "Get hiring Detail Success");
      })
      .catch((err) => res.send(err));
  },

  createHiring: async (req, res) => {
    const {
      hiring_title,
      hiring_message,
      pekerja_id,
      perekrut_id,
      pekerja_name,
      pekerja_email,
      perekrut_perusahaan,
    } = req.body;
    const hiring_id = uuidv4();
    const data = {
      hiring_id,
      hiring_title,
      hiring_message,
      pekerja_name,
      pekerja_id,
      pekerja_email,
      perekrut_id,
      perekrut_perusahaan,
    };

    await sendemailhiring(
      perekrut_perusahaan,
      pekerja_email,
      pekerja_name,
      hiring_title,
      hiring_message,
      `Job Offer: ${hiring_title} at ${perekrut_perusahaan}`
    );

    createHiring(data)
      .then((result) =>
        commonHelper.response(res, result.rows, 201, "Create hiring Success")
      )
      .catch((err) => res.send(err));
  },

  // updateSkill: async (req, res) => {
  //   try {
  //     const { skill_name } = req.body;
  //     const skill_id = String(req.params.id);
  //     const { rowCount } = await findUUID(por_id);
  //     if (!rowCount) {
  //       res.json({ message: "ID Not Found" });
  //     }
  //     const data = {
  //       skill_id,
  //       skill_name,
  //     };

  //     updateSkill(data)
  //       .then((result) =>
  //         commonHelper.response(res, result.rows, 200, "Update Skill Success")
  //       )
  //       .catch((err) => res.send(err));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },

  deleteHiring: async (req, res) => {
    try {
      const hiring_id = String(req.params.id);
      const { rowCount } = await findUUID(hiring_id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      deleteHiring(hiring_id)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Delete hiring Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = hiringController;