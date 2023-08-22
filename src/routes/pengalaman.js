const express = require("express");
const router = express.Router();
const pengalamanController = require("../controller/pengalaman");

router
  .get("/", pengalamanController.getAllPengalaman)
  .get("/:id", pengalamanController.getPengalalamanById)
  .get("/pekerja/:pekerja_id", pengalamanController.getPengalamanByPekerjaId)
  .post("/", pengalamanController.insertPengalaman)
  .put("/:id", pengalamanController.updatePengalaman)
  .delete("/:id", pengalamanController.deletePengalaman)
  .delete("/pekerja/:pekerja_id/:pengalaman_kerja_id", pengalamanController.deletePengalamanByPekerjaId);


module.exports = router;