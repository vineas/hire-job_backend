const express = require("express");
const router = express.Router();
const pekerjaRouter = require("../routes/pekerja");
const perekrutRouter = require("../routes/perekrut");
const portofolioRouter = require("../routes/portofolio");
const pengalamanRouter = require("../routes/pengalaman");
const skillRouter = require("../routes/skill");

router.use("/pekerja", pekerjaRouter);
router.use("/perekrut", perekrutRouter);
router.use("/pengalaman", pengalamanRouter);
router.use("/portofolio", portofolioRouter);
router.use("/skill", skillRouter);

module.exports = router;
