const Pool = require("../config/db");

//GET ALL
const selectAllHiring = ({ limit, offset, sort, sortby }) => {
  return Pool.query(
    `SELECT * FROM hiring ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
};

//GET SELECT USERS
const selectHiringPerekrut = (pekerja_id) => {
  return Pool.query(`SELECT * FROM hiring WHERE pekerja_id = '${pekerja_id}'`);
};

const selectHiringPekerja = (perekrut_id) => {
  return Pool.query(`SELECT * FROM hiring WHERE perekrut_id = '${perekrut_id}'`);
};

//DELETE SELECT USERS
const deleteHiring = (hiring_id) => {
  return Pool.query(`DELETE FROM hiring WHERE hiring_id  = '${hiring_id}'`);
};

//POST USERS
const createHiring = (data) => {
  const {
    hiring_id,
    hiring_title,
    hiring_message,
    pekerja_id,
    perekrut_id,
    pekerja_name,
    pekerja_email,
    perekrut_perusahaan,
  } = data;
  return Pool.query(`INSERT INTO hiring(hiring_id, hiring_title, hiring_message,pekerja_id, perekrut_id, pekerja_name, pekerja_email, perekrut_perusahaan)  
    VALUES ('${hiring_id}','${hiring_title}','${hiring_message}','${pekerja_id}','${perekrut_id}','${pekerja_name}','${pekerja_email}','${perekrut_perusahaan}')`);
};

//PUT SELECT USERS
// const updateSkill = (data) => {
//   const { skill_id, skill_name } = data;
//   return Pool.query(
//     `UPDATE skill SET skill_name = '${skill_name}' WHERE skill_id = '${skill_id}'`
//   );
// };

//FIND EMAIL
const findUUID = (hiring_id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM hiring WHERE hiring_id= '${hiring_id}' `,
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


//COUNT DATA
const countData = () => {
  return Pool.query(`SELECT COUNT(*) FROM hiring`);
};

module.exports = {
  selectAllHiring,
  selectHiringPekerja,
  selectHiringPerekrut,
  deleteHiring,
  createHiring,
  findUUID,
  countData,
};