const Pool = require("../config/db");

// GET ALL PORTOFOLIO
const selectAllPortofolio = ({ limit, offset, sort, sortby }) => {
    return Pool.query(`
  SELECT *
  FROM portofolio
  ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`);
};

// SELECT RICAPES BY ID
const selectPortofolioById = (portofolio_id) => {
    return Pool.query(`
  SELECT *
  FROM portofolio
  WHERE portofolio.portofolio_id='${portofolio_id}'`);
};

// SELECT RICAPES BY USERS ID
const selectPortofolioByPekerjaId = (pekerja_id) => {
    return Pool.query(`
  SELECT *
  FROM portofolio
  LEFT JOIN pekerja ON portofolio.pekerja_id = pekerja.pekerja_id
  WHERE portofolio.pekerja_id='${pekerja_id}'`);
};

// INSERT PORTOFOLIO
const insertPortofolio = (data) => {
    const {
        portofolio_id,
        portofolio_name,
        link_repository,
        portofolio_image,
        pekerja_id
    } = data;
    return Pool.query(
        `INSERT INTO portofolio (
            portofolio_id,
            portofolio_name,
            link_repository,
            portofolio_image,
            pekerja_id
            ) VALUES(
                '${portofolio_id}', 
                '${portofolio_name}', 
                '${link_repository}', 
                '${portofolio_image}', 
                '${pekerja_id}')`
    );
};

// UPDATE Pengalaman
const updatePortofolio = (data) => {
    const {
        portofolio_id,
        portofolio_name,
        link_repository,
        portofolio_image,
        pekerja_id
    } = data;
    return Pool.query(
        `UPDATE portofolio SET portofolio_name='${portofolio_name}', link_repository='${link_repository}' ,portofolio_image='${portofolio_image}',pekerja_id='${pekerja_id}'
        WHERE portofolio_id='${portofolio_id}'`
    );
};

// DELETE PORTOFOLIO
const deletePortofolio = (portofolio_id) => {
    return Pool.query(`DELETE FROM portofolio WHERE portofolio_id='${portofolio_id}'`);
};

const deletePortofolioByPekerjaId = (pekerja_id, portofolio_id) => {
    return Pool.query(`DELETE FROM portofolio WHERE portofolio.pekerja_id='${pekerja_id}' AND portofolio.portofolio_id='${portofolio_id}'`);
};
// COUNT DATA
const countData = () => {
    return Pool.query("SELECT COUNT(*) FROM portofolio");
};

// FIND UUID
const findUUID = (portofolio_id) => {
    return new Promise((resolve, reject) =>
        Pool.query(
            `SELECT portofolio FROM portofolio WHERE portofolio_id='${portofolio_id}'`,
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
            `SELECT portofolio FROM portofolio WHERE pekerja_id='${pekerja_id}'`,
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
};