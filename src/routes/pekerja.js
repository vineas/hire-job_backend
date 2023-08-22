const express = require("express");
const router = express.Router();
const uploadPekerja = require("../middlewares/uploadPekerja");
const pekerjaController = require("../controller/pekerja");
router
  .post("/register", uploadPekerja, pekerjaController.registerPekerja)
  .post("/login", pekerjaController.loginpekerja)
  .get("/profile/:id", pekerjaController.getSelectPekerja)
  .get("/profile", pekerjaController.getAllPekerja)
  .put("/profile/:id", uploadPekerja, pekerjaController.updatepekerja)
  .put("/password/:id", uploadPekerja, pekerjaController.updatePasswordpekerja)
  .delete("/profile/:id", pekerjaController.deletepekerja);
module.exports = router;
  