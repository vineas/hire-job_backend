const Pool = require("../config/db");

// GET ALL RECIPES
const selectAllPengalaman = ({ limit, offset, sort, sortby }) => {
    return Pool.query(`
  SELECT *
  FROM pengalaman_kerja
  ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`);
};

// SELECT RICAPES BY ID
const selectPengalamanById = (pengalaman_kerja_id) => {
    return Pool.query(`
  SELECT *
  FROM pengalaman_kerja
  WHERE pengalaman_kerja.pengalaman_kerja_id='${pengalaman_kerja_id}'`);
};

// SELECT RICAPES BY USERS ID
const selectPengalamanByPekerjaId = (pekerja_id) => {
    return Pool.query(`
  SELECT *
  FROM pengalaman_kerja
  LEFT JOIN pekerja ON pengalaman_kerja.pekerja_id = pekerja.pekerja_id
  WHERE pengalaman_kerja.pekerja_id='${pekerja_id}'`);
};

// INSERT RECIPES
const insertPengalaman = (data) => {
    const {
        pengalaman_kerja_id,
        posisi,
        nama_perusahaan,
        dari,
        sampai,
        deskripsi,
        pekerja_id
    } = data;
    return Pool.query(
        `INSERT INTO pengalaman_kerja (
            pengalaman_kerja_id,
            posisi,
            nama_perusahaan,
            dari,
            sampai,
            deskripsi,
            pekerja_id) VALUES('${pengalaman_kerja_id}', '${posisi}', '${nama_perusahaan}', '${dari}', '${sampai}', '${deskripsi}','${pekerja_id}')`
    );
};

// UPDATE Pengalaman
const updatePengalaman = (data) => {
    const {
        pengalaman_kerja_id,
        posisi,
        nama_perusahaan,
        dari,
        sampai,
        deskripsi,
    } = data;
    return Pool.query(
        `UPDATE pengalaman_kerja SET posisi='${posisi}', nama_perusahaan='${nama_perusahaan}' ,dari='${dari}',sampai='${sampai}', deskripsi='${deskripsi}'
        WHERE pengalaman_kerja_id='${pengalaman_kerja_id}'`
    );
};

// DELETE RECIPES
const deletePengalaman = (pengalaman_kerja_id) => {
    return Pool.query(`DELETE FROM pengalaman_kerja WHERE pengalaman_kerja_id='${pengalaman_kerja_id}'`);
};

const deletePengalamanByPekerjaId = (pekerja_id, pengalaman_kerja_id) => {
    return Pool.query(`DELETE FROM pengalaman_kerja WHERE pengalaman_kerja.pekerja_id='${pekerja_id}' AND pengalaman_kerja.pengalaman_kerja_id='${pengalaman_kerja_id}'`);
};
// COUNT DATA
const countData = () => {
    return Pool.query("SELECT COUNT(*) FROM pengalaman_kerja");
};

// FIND UUID
const findUUID = (pengalaman_kerja_id) => {
    return new Promise((resolve, reject) =>
        Pool.query(
            `SELECT pengalaman_kerja FROM pengalaman_kerja WHERE pengalaman_kerja_id='${pengalaman_kerja_id}'`,
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

// FIND UUID
const findPekerjaId = (pekerja_id) => {
    return new Promise((resolve, reject) =>
        Pool.query(
            `SELECT pengalaman_kerja FROM pengalaman_kerja WHERE pekerja_id='${pekerja_id}'`,
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
};