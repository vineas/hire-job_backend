const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const authHelper = require("../helper/auth");
const commonHelper = require("../helper/common");
const cloudinary = require("../middlewares/cloudinary");
let {
  selectAllpekerja,
  selectpekerja,
  deletepekerja,
  createpekerja,
  updatepekerja,
  updatePasswordpekerja,
  findUUID,
  findEmail,
  countData,
} = require("../model/pekerja");

let pekerjaController = {
  getAllPekerja: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "pekerja_id";
      const sort = req.query.sort || "ASC";
      let result = await selectAllpekerja({ limit, offset, sort, sortby });
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
        "Get pekerja Data Success",
        pagination
      );
    } catch (err) {
      console.log(err);
    }
  },

  getSelectPekerja: async (req, res) => {
    const pekerja_id = String(req.params.id);
    const { rowCount } = await findUUID(pekerja_id);
    if (!rowCount) {
      return res.json({ message: "ID Not Found" });
    }
    selectpekerja(pekerja_id)
      .then((result) => {
        commonHelper.response(
          res,
          result.rows,
          200,
          "Get pekerja Detail Success"
        );
      })
      .catch((err) => res.send(err));
  },

  registerPekerja: async (req, res) => {
    const {
      pekerja_name,
      pekerja_email,
      pekerja_phone,
      pekerja_password,
      pekerja_confirmpassword,
    } = req.body;
    const { rowCount } = await findEmail(pekerja_email);
    if (rowCount) {
      return res.json({ message: "Email Already Taken" });
    }

    const pekerja_id = uuidv4();
    // let pekerja_photo = null;
    // if (req.file) {
    //   const result = await cloudinary.uploader.upload(req.file.path);
    //   pekerja_photo = result.secure_url;
    // }
    const schema = Joi.object().keys({
      pekerja_email: Joi.required(),
      pekerja_name: Joi.string().required(),
      pekerja_phone: Joi.string().min(10).max(12),
      pekerja_password: Joi.string().min(3).max(15).required(),
      pekerja_confirmpassword: Joi.ref("pekerja_password"),
      // pekerja_photo: Joi.string().allow(""),
    });
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      console.log(error);
      return res.send(error.details);
    }
    const pekerja_confirmpasswordHash = bcrypt.hashSync(pekerja_confirmpassword);
    const data = {
      pekerja_id,
      pekerja_name,
      pekerja_email,
      pekerja_phone,
      pekerja_confirmpasswordHash,
      // pekerja_photo,
    };
    createpekerja(data)
      .then((result) =>
        commonHelper.response(res, result.rows, 201, "Create User Success")
      )
      .catch((err) => res.send(err));
  },

  updatepekerja: async (req, res) => {
    try {
      const { pekerja_name, pekerja_jobdesk, pekerja_domisili, pekerja_tempat_kerja, pekerja_deskripsi} = req.body;
      const pekerja_id = String(req.params.id);
      const { rowCount } = await findUUID(pekerja_id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      const schema = Joi.object().keys({
        pekerja_photo: Joi.any(),
        pekerja_name: Joi.string().required(),
        pekerja_jobdesk: Joi.string().required(),
        pekerja_domisili: Joi.string().required(),
        pekerja_tempat_kerja: Joi.string().required(),
        pekerja_deskripsi: Joi.string().required()
      });
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        console.log(error);
        return res.send(error.details);
      }
      let pekerja_photo = null;
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        pekerja_photo = result.secure_url;
      }
      const data = {
        pekerja_id,
        pekerja_name,
        pekerja_photo,
        pekerja_jobdesk, 
        pekerja_domisili, 
        pekerja_tempat_kerja,
        pekerja_deskripsi
      };

      updatepekerja(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Update pekerja Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  updatePasswordpekerja: async (req, res) => {
    try {
      const { pekerja_password, pekerja_confirmpassword } = req.body;
      const pekerja_id = String(req.params.id);
      const { rowCount } = await findUUID(pekerja_id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      const schema = Joi.object().keys({
        pekerja_password: Joi.string().min(3).max(15),
        pekerja_confirmpassword: Joi.ref("pekerja_password"),
      });
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        console.log(error);
        return res.send(error.details);
      }
      let pekerja_photo = null;
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        pekerja_photo = result.secure_url;
      }
      const pekerja_confirmpasswordHash = bcrypt.hashSync(pekerja_confirmpassword);
      const data = {
        pekerja_id,
        pekerja_confirmpasswordHash,
      };

      updatePasswordpekerja(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Update pekerja Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  deletepekerja: async (req, res) => {
    try {
      const pekerja_id = String(req.params.id);
      const { rowCount } = await findUUID(pekerja_id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      deletepekerja(pekerja_id)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Delete pekerja Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  loginpekerja: async (req, res) => {
    const { pekerja_email, pekerja_confirmpassword } = req.body;
    const {
      rows: [pekerja],
    } = await findEmail(pekerja_email);
    if (!pekerja) {
      return res.json({ message: "Email Wrong" });
    }
    const isValidPassword = bcrypt.compareSync(
      pekerja_confirmpassword,
      pekerja.pekerja_confirmpassword
    );
    if (!isValidPassword) {
      return res.json({ message: "Password Wrong" });
    }
    delete pekerja.pekerja_confirmpassword;
    const payload = {
      pekerja_email: pekerja.pekerja_email,
    };
    pekerja.token_user = authHelper.generateToken(payload);
    pekerja.refreshToken = authHelper.generateRefreshToken(payload);
    commonHelper.response(res, pekerja, 201, "Login Successfuly");
  },

  refreshToken: (req, res) => {
    const refreshToken = req.body.refreshToken;
    const decoded = jwt.verify(refreshToken, process.env.SECRETE_KEY_JWT);
    const payload = {
      pekerja_email: decoded.pekerja_email,
    };
    const result = {
      token_user: authHelper.generateToken(payload),
      refreshToken: authHelper.generateRefreshToken(payload),
    };
    commonHelper.response(res, result, 200);
  },
};

module.exports = pekerjaController;
