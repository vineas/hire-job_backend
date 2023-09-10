
const Pool = require("../config/db");

//GET ALL perekrut
const selectAllperekrut = ({ limit, offset, sort, sortby }) => {
  return Pool.query(
    `SELECT * FROM perekrut ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
};

//GET SELECT perekrut
const selectperekrut = (perekrut_id) => {
  return Pool.query(`SELECT * FROM perekrut WHERE perekrut_id = '${perekrut_id}'`);
};

//DELETE SELECT perekrut
const deleteperekrut = (perekrut_id) => {
  return Pool.query(`DELETE FROM perekrut WHERE perekrut_id = '${perekrut_id}'`);
};

//POST perekrut
const createperekrut = (data) => {
  const {
    perekrut_id, 
    perekrut_name,
    perekrut_email, 
    perekrut_perusahaan, 
    perekrut_jabatan, 
    perekrut_phone, 
    perekrut_password, 
    perekrut_confirmpasswordHash
  } = data;
  return Pool.query(`INSERT INTO perekrut(
    perekrut_id, 
    perekrut_name,
    perekrut_email, 
    perekrut_perusahaan, 
    perekrut_jabatan, 
    perekrut_phone, 
    perekrut_password, 
    perekrut_confirmpassword
    ) 
    VALUES (
        '${perekrut_id}',
        '${perekrut_name}',
        '${perekrut_email}',
        '${perekrut_perusahaan}', 
        '${perekrut_jabatan}', 
        '${perekrut_phone}', 
        '${perekrut_password}',
        '${perekrut_confirmpasswordHash}'
        )`);
};

//PUT SELECT perekrut
const updateperekrut = (data) => {
  const { perekrut_id,
    perekrut_perusahaan,
    perekrut_photo,
    perekrut_bidang,
    perekrut_kota,
    perekrut_deskripsi,
    perekrut_instagram,
    perekrut_phone,
    perekrut_linkedin} = data;
  return Pool.query(
    `UPDATE perekrut SET 
    perekrut_perusahaan = '${perekrut_perusahaan}', 
    perekrut_photo = '${perekrut_photo}', 
    perekrut_bidang = '${perekrut_bidang}', 
    perekrut_kota = '${perekrut_kota}', 
    perekrut_deskripsi = '${perekrut_deskripsi}', 
    perekrut_instagram = '${perekrut_instagram}',
    perekrut_phone = '${perekrut_phone}',
    perekrut_linkedin = '${perekrut_linkedin}'
    WHERE perekrut_id = '${perekrut_id}'`
  );
};

const updatePasswordperekrut = (data) => {
  const { perekrut_id, perekrut_password, perekrut_confirmpasswordHash } =
    data;
  return Pool.query(
    `UPDATE perekrut SET perekrut_password = '${perekrut_password}', perekrut_confirmpassword = '${perekrut_confirmpasswordHash}'WHERE perekrut_id = '${perekrut_id}'`
  );
};

//FIND EMAIL
const findUUID = (perekrut_id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM perekrut WHERE perekrut_id= '${perekrut_id}' `,
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

const findEmail = (perekrut_email) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM perekrut WHERE perekrut_email= '${perekrut_email}' `,
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
  return Pool.query(`SELECT COUNT(*) FROM perekrut`);
};

module.exports = {
  selectAllperekrut,
  selectperekrut,
  deleteperekrut,
  createperekrut,
  updateperekrut,
  updatePasswordperekrut,
  findUUID,
  findEmail,
  countData,
};
