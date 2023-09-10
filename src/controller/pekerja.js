const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const createError = require("http-errors");
const authHelper = require("../helper/auth");
const commonHelper = require("../helper/common");
const sendEmail = require("../middlewares/sendemail");
const crypto = require("crypto");
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
  registerPekerja, createPekerjaVerification,
  checkPekerjaVerification,
  cekPekerja,
  deletePekerjaVerification,
  updateAccountVerification,
  findId
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
    try {
      const {
        pekerja_name,
        pekerja_email,
        pekerja_phone,
        pekerja_password,
        pekerja_confirmpassword,
      } = req.body;
      // const { rowCount } = await findEmail(pekerja_email);
      // if (rowCount) {
      //   return res.json({ message: "Email Already Taken" });
      // }

      const checkEmail = await findEmail(pekerja_email);
      try {
        if (checkEmail.rowCount == 1) throw "Email already used";
        // delete checkEmail.rows[0].password;
      } catch (error) {
        delete checkEmail.rows[0].password;
        return commonHelper.response(res, null, 403, error);
      }

      const saltRounds = 10;
      const pekerja_confirmpasswordHash = bcrypt.hashSync(pekerja_confirmpassword, saltRounds);
      const pekerja_id = uuidv4().toLocaleLowerCase();

      // verification
      const verify = "false";
      const pekerja_verification_id = uuidv4().toLocaleLowerCase();
      const users_id = pekerja_id;
      const token = crypto.randomBytes(64).toString("hex");

      // url localhost
      const url = `${process.env.BASE_URL}pekerja/verify?id=${users_id}&token=${token}`;

      //send email
      await sendEmail(pekerja_email, "Verify Email", url);

      // insert db table users
      // await registerPekerja(id, email, passwordHash, verify);
      await registerPekerja(
        pekerja_id,
        pekerja_email,
        pekerja_password,
        pekerja_confirmpasswordHash,
        pekerja_name,
        pekerja_phone,
        verify);

      // insert db table verification
      await createPekerjaVerification(
        pekerja_verification_id,
        users_id,
        token
      );
      commonHelper.response(
        res,
        null,
        201,
        "Sign Up Success, Please check your email for verification"
      );

      // const pekerja_id = uuidv4();
      // const schema = Joi.object().keys({
      //   pekerja_email: Joi.required(),
      //   pekerja_name: Joi.string().required(),
      //   pekerja_phone: Joi.string().min(10).max(12),
      //   pekerja_password: Joi.string().min(3).max(15).required(),
      //   pekerja_confirmpassword: Joi.ref("pekerja_password"),
      // });
      // const { error, value } = schema.validate(req.body, {
      //   abortEarly: false,
      // });
      // if (error) {
      //   console.log(error);
      //   return res.send(error.details);
      // }

    } catch (error) {
      console.log(error);
      res.send(createError(400));
    }


    // const pekerja_confirmpasswordHash = bcrypt.hashSync(pekerja_confirmpassword);
    // const data = {
    //   pekerja_id,
    //   pekerja_name,
    //   pekerja_email,
    //   pekerja_phone,
    //   pekerja_confirmpasswordHash,
    //   // pekerja_photo,
    // };
    // registerPekerja(data)
    //   .then((result) =>
    //     commonHelper.response(res, result.rows, 201, "Create User Success")
    //   )
    //   .catch((err) => res.send(err));
  },

  VerifyAccount: async (req, res) => {
    try {
      const queryPekerjaId = req.query.id;
      const queryToken = req.query.token;

      if (typeof queryPekerjaId === "string" && typeof queryToken === "string") {
        const checkPekerjaVerify = await findId(queryPekerjaId);

        if (checkPekerjaVerify.rowCount == 0) {
          return commonHelper.response(
            res,
            null,
            403,
            "Error users has not found"
          );
        }

        if (checkPekerjaVerify.rows[0].verify != "false") {
          return commonHelper.response(
            res,
            null,
            403,
            "Users has been verified"
          );
        }

        const result = await checkPekerjaVerification(
          queryPekerjaId,
          queryToken
        );

        if (result.rowCount == 0) {
          return commonHelper.response(
            res,
            null,
            403,
            "Error invalid credential verification"
          );
        } else {
          await updateAccountVerification(queryPekerjaId);
          await deletePekerjaVerification(queryPekerjaId, queryToken);
          commonHelper.response(res, null, 200, "Users verified succesful");
        }
      } else {
        return commonHelper.response(
          res,
          null,
          403,
          "Invalid url verification"
        );
      }
    } catch (error) {
      console.log(error);

      // res.send(createError(404));
    }
  },


  loginpekerja: async (req, res) => {
    // const { pekerja_email, pekerja_confirmpassword } = req.body;
    // const {
    //   rows: [pekerja],
    // } = await findEmail(pekerja_email);
    // if (!pekerja) {
    //   return res.json({ message: "Email Wrong" });
    // }
    // const isValidPassword = bcrypt.compareSync(
    //   pekerja_confirmpassword,
    //   pekerja.pekerja_confirmpassword
    // );
    // if (!isValidPassword) {
    //   return res.json({ message: "Password Wrong" });
    // }
    // delete pekerja.pekerja_confirmpassword;
    // const payload = {
    //   pekerja_email: pekerja.pekerja_email,
    // };
    // pekerja.token_user = authHelper.generateToken(payload);
    // pekerja.refreshToken = authHelper.generateRefreshToken(payload);
    // commonHelper.response(res, pekerja, 201, "Login Successfuly");

    // ==================================================================//

    try {
      const { pekerja_email, pekerja_confirmpassword } = req.body;
      const {
        rows: [pekerja],
      } = await findEmail(pekerja_email);
      if (!pekerja) {
        return res.json({ message: "Email Incorrect" });
      }
      const isValidPassword = bcrypt.compareSync(
        pekerja_confirmpassword,
        pekerja.pekerja_confirmpassword
      );
      if (!isValidPassword) {
        return res.json({ message: "Password Incorrect" });
      }
      const { rows: [verify] } = await cekPekerja(pekerja_email);
      console.log(verify.verify);
      if (verify.verify === "false") {
        return res.json({
          message: "user is unverify"
        })
      }

      // if (!pekerja) {
      //   return commonHelper.response(res, null, 403, "Email is invalid");
      // }
      // const isValidPassword = bcrypt.compareSync(pekerja_confirmpassword, pekerja.pekerja_confirmpassword);
      // console.log(isValidPassword);

      // if (!isValidPassword) {
      //   return commonHelper.response(res, null, 403, "Password is invalid");
      // }
      delete pekerja.pekerja_confirmpassword;
      const payload = {
        email: pekerja.pekerja_email,
        // role: user.role,
      };
      pekerja.token = authHelper.generateToken(payload);
      pekerja.refreshToken = authHelper.generateRefreshToken(payload);

      commonHelper.response(res, pekerja, 201, "login is successful");
    } catch (error) {
      console.log(error);
    }
  },

  sendEmail: async (req, res, next) => {
    const { pekerja_email } = req.body;
    await sendEmail(pekerja_email, "Verify Email", url);
  },
  profile: async (req, res, next) => {
    const pekerja_email = req.payload.pekerja_email;
    const {
      rows: [user],
    } = await findEmail(pekerja_email);
    delete pekerja.pekerja_password;
    commonHelper.response(res, user, 200);
  },

  updatepekerja: async (req, res) => {
    try {
      const { pekerja_name, pekerja_jobdesk, pekerja_domisili, pekerja_tempat_kerja, pekerja_deskripsi } = req.body;
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
