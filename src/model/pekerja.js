const Pool = require("../config/db");

//GET ALL pekerja

const selectAllpekerja = ({ limit, offset, sort, sortby }) => {
  return Pool.query(
    `SELECT pekerja.*, ARRAY_AGG(skill.skill_name) AS skill_names
    FROM pekerja
    LEFT JOIN skill ON pekerja.pekerja_id = skill.pekerja_id
    GROUP BY pekerja.pekerja_id
    ORDER BY ${sortby} ${sort}
    LIMIT ${limit} OFFSET ${offset}`
  );
};


//GET SELECT pekerja
const selectpekerja = (pekerja_id) => {
  return Pool.query(`SELECT * FROM pekerja WHERE pekerja_id = '${pekerja_id}'`);
};

//DELETE SELECT pekerja
const deletepekerja = (pekerja_id) => {
  return Pool.query(`DELETE FROM pekerja WHERE pekerja_id = '${pekerja_id}'`);
};

//POST pekerja
const createpekerja = (data) => {
  const {
    pekerja_id,
    pekerja_email,
    pekerja_password,
    pekerja_confirmpasswordHash,
    pekerja_name,
    pekerja_phone,
    pekerja_photo,
    pekerja_jobdesk,
    pekerja_domisili,
    pekerja_tempat_kerja,
    pekerja_deskripsi
  } = data;
  return Pool.query(`INSERT INTO pekerja(
    pekerja_id, 
    pekerja_email, 
    pekerja_password, 
    pekerja_confirmpassword,  
    pekerja_name, 
    pekerja_phone, 
    pekerja_photo, 
    pekerja_jobdesk, 
    pekerja_domisili, 
    pekerja_tempat_kerja, 
    pekerja_deskripsi
    ) 
    VALUES (
      '${pekerja_id}',
      '${pekerja_email}',
      '${pekerja_password}',
      '${pekerja_confirmpasswordHash}',
      '${pekerja_name}',
    '${pekerja_phone}', 
    '${pekerja_photo}', 
    '${pekerja_jobdesk}', '${pekerja_domisili}', '${pekerja_tempat_kerja}', '${pekerja_deskripsi}')`);
};

//PUT SELECT pekerja
const updatepekerja = (data) => {
  const { pekerja_id, pekerja_name, pekerja_photo, pekerja_jobdesk, pekerja_domisili, pekerja_tempat_kerja, pekerja_deskripsi } = data;
  return Pool.query(
    `UPDATE pekerja SET pekerja_name = '${pekerja_name}', pekerja_photo = '${pekerja_photo}', pekerja_jobdesk = '${pekerja_jobdesk}', pekerja_domisili = '${pekerja_domisili}', pekerja_tempat_kerja = '${pekerja_tempat_kerja}', pekerja_deskripsi = '${pekerja_deskripsi}' WHERE pekerja_id = '${pekerja_id}'`
  );
};

const updatePasswordpekerja = (data) => {
  const { pekerja_id, pekerja_email, pekerja_password, pekerja_confirmpasswordHash } =
    data;
  return Pool.query(
    `UPDATE pekerja SET pekerja_password = '${pekerja_password}', pekerja_confirmpassword = '${pekerja_confirmpasswordHash}'WHERE pekerja_id = '${pekerja_id}'`
  );
};

//FIND EMAIL
const findUUID = (pekerja_id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM pekerja WHERE pekerja_id= '${pekerja_id}' `,
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

const findEmail = (pekerja_email) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM pekerja WHERE pekerja_email= '${pekerja_email}' `,
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
  return Pool.query(`SELECT COUNT(*) FROM pekerja`);
};

module.exports = {
  selectAllpekerja,
  selectpekerja,
  deletepekerja,
  createpekerja,
  updatepekerja,
  updatePasswordpekerja,
  findUUID,
  findEmail,
  countData,
};
