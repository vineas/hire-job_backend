const express = require("express");
const router = express.Router();
const uploadPerekrut = require("../middlewares/uploadPerekrut");
const perekrutController = require("../controller/perekrut");
router
  .post("/register", perekrutController.registerperekrut)
  .post("/login", perekrutController.loginperekrut)
  .get("/profile/:id", perekrutController.getSelectperekrut)
  .get("/profile", perekrutController.getAllperekrut)
  .put("/profile/:id", uploadPerekrut, perekrutController.updateperekrut)
  .put("/password/:id", uploadPerekrut, perekrutController.updatePasswordperekrut)
  .delete("/profile/:id", perekrutController.deleteperekrut);
module.exports = router;
  