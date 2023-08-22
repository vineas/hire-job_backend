const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const authHelper = require("../helper/auth");
const commonHelper = require("../helper/common");
const cloudinary = require("../middlewares/cloudinary");
let {
  selectAllperekrut,
  selectperekrut,
  deleteperekrut,
  createperekrut,
  updateperekrut,
  updatePasswordperekrut,
  findUUID,
  findEmail,
  countData,
} = require("../model/perekrut");

let perekrutController = {
  getAllperekrut: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "perekrut_id";
      const sort = req.query.sort || "ASC";
      let result = await selectAllperekrut({ limit, offset, sort, sortby });
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
        "Get perekrut Data Success",
        pagination
      );
    } catch (err) {
      console.log(err);
    }
  },

  getSelectperekrut: async (req, res) => {
    const perekrut_id = String(req.params.id);
    const { rowCount } = await findUUID(perekrut_id);
    if (!rowCount) {
      return res.json({ message: "ID Not Found" });
    }
    selectperekrut(perekrut_id)
      .then((result) => {
        commonHelper.response(
          res,
          result.rows,
          200,
          "Get perekrut Detail Success"
        );
      })
      .catch((err) => res.send(err));
  },

  registerperekrut: async (req, res) => {
    const {
      perekrut_name,
      perekrut_email,
      perekrut_perusahaan,
      perekrut_jabatan,
      perekrut_phone,
      perekrut_password,
      perekrut_confirmpassword
    } = req.body;
    const { rowCount } = await findEmail(perekrut_email);
    if (rowCount) {
      return res.json({ message: "Email Already Taken" });
    }

    const perekrut_id = uuidv4();
    let perekrut_photo = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      perekrut_photo = result.secure_url;
    }
    const schema = Joi.object().keys({
      perekrut_name: Joi.string().required(),
      perekrut_email: Joi.required(),
      perekrut_perusahaan: Joi.string().required(),
      perekrut_jabatan: Joi.string().required(),
      perekrut_phone: Joi.string().min(10).max(12),
      perekrut_password: Joi.string().min(3).max(15).required(),
      perekrut_confirmpassword: Joi.ref("perekrut_password"),
      perekrut_photo: Joi.string().allow(""),
    });
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      console.log(error);
      return res.send(error.details);
    }
    const perekrut_confirmpasswordHash = bcrypt.hashSync(perekrut_confirmpassword);
    const data = {
      perekrut_id,
      perekrut_name,
      perekrut_email,
      perekrut_perusahaan,
      perekrut_jabatan,
      perekrut_phone,
      perekrut_password,
      perekrut_confirmpasswordHash,
      perekrut_photo 
    };
    createperekrut(data)
      .then((result) =>
        commonHelper.response(res, result.rows, 201, "Create Perekrut Success")
      )
      .catch((err) => res.send(err));
  },

  updateperekrut: async (req, res) => {
    try {
      const { perekrut_perusahaan, perekrut_phone,perekrut_bidang, perekrut_kota, perekrut_deskripsi,perekrut_instagram, perekrut_linkedin} = req.body;
      const perekrut_id = String(req.params.id);
      const { rowCount } = await findUUID(perekrut_id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      const schema = Joi.object().keys({
          perekrut_photo: Joi.any(),
          perekrut_perusahaan: Joi.string().required(),
        perekrut_bidang: Joi.string().required(),
        perekrut_kota: Joi.string().required(),
        perekrut_deskripsi: Joi.string().required(),
        perekrut_instagram: Joi.string().required(),
        perekrut_phone: Joi.string().min(10).max(12),
        perekrut_linkedin: Joi.string().required()
      });
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        console.log(error);
        return res.send(error.details);
      }
      let perekrut_photo = null;
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        perekrut_photo = result.secure_url;
      }
      const data = {
        perekrut_id,
        perekrut_perusahaan,
        perekrut_photo,
        perekrut_bidang,
        perekrut_kota,
        perekrut_deskripsi,
        perekrut_instagram,
        perekrut_phone,
        perekrut_linkedin
        };

      updateperekrut(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Update perekrut Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  updatePasswordperekrut: async (req, res) => {
    try {
      const { perekrut_password, perekrut_confirmpassword } = req.body;
      const perekrut_id = String(req.params.id);
      const { rowCount } = await findUUID(perekrut_id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      const schema = Joi.object().keys({
        perekrut_password: Joi.string().min(3).max(15),
        perekrut_confirmpassword: Joi.ref("perekrut_password"),
      });
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        console.log(error);
        return res.send(error.details);
      }
      let perekrut_photo = null;
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        perekrut_photo = result.secure_url;
      }
      const perekrut_confirmpasswordHash = bcrypt.hashSync(perekrut_confirmpassword);
      const data = {
        perekrut_id,
        perekrut_confirmpasswordHash,
      };

      updatePasswordperekrut(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Update perekrut Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  deleteperekrut: async (req, res) => {
    try {
      const perekrut_id = String(req.params.id);
      const { rowCount } = await findUUID(perekrut_id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      deleteperekrut(perekrut_id)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Delete perekrut Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  loginperekrut: async (req, res) => {
    const { perekrut_email, perekrut_confirmpassword } = req.body;
    const {
      rows: [perekrut],
    } = await findEmail(perekrut_email);
    if (!perekrut) {
      return res.json({ message: "Email Wrong" });
    }
    const isValidPassword = bcrypt.compareSync(
      perekrut_confirmpassword,
      perekrut.perekrut_confirmpassword
    );
    if (!isValidPassword) {
      return res.json({ message: "Password Wrong" });
    }
    delete perekrut.perekrut_confirmpassword;
    const payload = {
      perekrut_email: perekrut.perekrut_email,
    };
    perekrut.token_user = authHelper.generateToken(payload);
    perekrut.refreshToken = authHelper.generateRefreshToken(payload);
    commonHelper.response(res, perekrut, 201, "Login Successfuly");
  },

  refreshToken: (req, res) => {
    const refreshToken = req.body.refreshToken;
    const decoded = jwt.verify(refreshToken, process.env.SECRETE_KEY_JWT);
    const payload = {
      perekrut_email: decoded.perekrut_email,
    };
    const result = {
      token_user: authHelper.generateToken(payload),
      refreshToken: authHelper.generateRefreshToken(payload),
    };
    commonHelper.response(res, result, 200);
  },
};

module.exports = perekrutController;