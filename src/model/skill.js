const Pool = require("../config/db");

// GET ALL Coments
const selectAllSkill = ({ limit, offset, sort, sortby }) => {
  return Pool.query(
    `SELECT * FROM skill ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
};

// SELECT RICAPES BY users and recipes id
const selectSkill = (pekerja_id) => {
  return Pool.query(`
  SELECT skill.*, pekerja.*,
  FROM skill
  LEFT JOIN pekerja ON skill.pekerja_id = pekerja.pekerja_id
  WHERE skill.pekerja_id = '${pekerja_id}'
  `);
};

// INSERT Coments
const insertSkill = (data) => {
  const { skill_id, skill_name, pekerja_id } = data;
  return Pool.query(
    `INSERT INTO skill (skill_id, skill_name, pekerja_id) 
    VALUES('${skill_id}', '${skill_name}', '${pekerja_id}')`
  );
};

// UPDATE Coments
const updateSkill = (data) => {
  const { skill_id, skill_name, pekerja_id } = data;
  return Pool.query(
    `UPDATE skill SET skill_name='${skill_name}' pekerja_id='${pekerja_id}' WHERE skill_id='${skill_id}'`
  );
};

// DELETE Coments
const deleteSkill = (skill_id) => {
  return Pool.query(`DELETE FROM skill WHERE skill_id='${skill_id}'`);
};

// COUNT DATA
const countData = () => {
  return Pool.query("SELECT COUNT(*) FROM skill");
};

//
const findID = (skill_id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT skill FROM Skill WHERE skill_id='${skill_id}'`,
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    )
  );
};

const findLikedsRecipesId = (recipes_id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM likeds WHERE recipes_id='${recipes_id}'`,
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    )
  );
};

const findSkillPekerjaId = (pekerja_id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM skill WHERE pekerja_id='${pekerja_id}'`,
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    )
  );
};

module.exports = {
  selectAllSkill,
  selectSkill,
  insertSkill,
  updateSkill,
  deleteSkill,
  findLikedsRecipesId,
  findSkillPekerjaId,
  countData,
  findID,
};