const express = require("express");
const router = express.Router();
const hiringController = require("../controller/hiring");
router
  .post("/", hiringController.createHiring)
  .get("/", hiringController.getAllHiring)
  .get("/worker/:id", hiringController.getSelectHiringPekerja)
  .get("/recruiter/:id", hiringController.getSelectHiringPerekrut)
  .delete("/:id", hiringController.deleteHiring);
module.exports = router;