const express = require("express");
const router = express.Router();
const uploadPortofolio = require("../middlewares/uploadPortofolio");
const portofolioController = require("../controller/portofolio");

router
  .get("/", portofolioController.getAllPortofolio)
  .get("/:id", portofolioController.getPortofolioById)
  .get("/pekerja/:pekerja_id", portofolioController.getPortofolioByPekerjaId)
  .post("/", uploadPortofolio, portofolioController.insertPortofolio)
  .put("/:id",uploadPortofolio, portofolioController.updatePortofolio)
  .delete("/:id", portofolioController.deletePortofolio)
  .delete("/pekerja/:pekerja_id/:portofolio_id", portofolioController.deletePortofolioByPekerjaId);


module.exports = router;