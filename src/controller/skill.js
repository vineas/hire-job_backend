const commonHelper = require("../helper/common");
const { v4: uuidv4 } = require("uuid");
const {
  selectAllSkill,
  selectSkill,
  insertSkill,
  updateSkill,
  deleteSkill,
  findSkillRecipesId,
  findSkillPekerjaId,
  countData,
  findID,
} = require("../model/skill");

const skillController = {
  getAllSkill: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "skill_id";
      const sort = req.query.sort || "ASC";
      const result = await selectAllSkill({ limit, offset, sort, sortby });
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

  getSelectSkill: async (req, res) => {
    const pekerja_id = String(req.params.pekerja_id);
    selectSkill(pekerja_id)
      .then((result) =>
        commonHelper.response(res, result.rows, 200, "get data success")
      )
      .catch((err) => res.send(err));
  },

  insertSkill: async (req, res) => {
    const { 
        pekerja_id, 
        skill_name 
    } = req.body;
    // const { rowCount: PekerjaSkill } = await findSkillPekerjaId(pekerja_id);
    // if (PekerjaSkill) {
    //   return res.json({ message: "Skill Already" });
    // }
    const skill_id = uuidv4();
    const data = {
      skill_id,
      skill_name,
      pekerja_id
    };
    insertSkill(data)
      .then((result) =>
        commonHelper.response(res, result.rows, 201, "Skill ditambahkan")
      )
      .catch((err) => res.send(err));
  },

  updateLikeds: async (req, res) => {
    try {
      const likeds_id = Number(req.params.id);
      const { comment_text } = req.body;
      const { rowCount } = await findID(likeds_id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      const data = {
        comment_id,
        recipes_id,
        users_id,
        comment_text,
      };
      updateLikeds(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Update comment Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  deleteSkill: async (req, res, next) => {
    try {
      const skill_id = String(req.params.id);
      const { rowCount } = await findID(skill_id);

      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      deleteSkill(skill_id)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Delete skill Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = skillController;