const express = require("express");
const router = express.Router();
const skillController = require("../controller/skill");
router
  .get("/", skillController.getAllSkill)
  .get("/:pekerja_id", skillController.getSelectSkill)
  .post("/", skillController.insertSkill)
  .put("/:id", skillController.updateLikeds)
  .delete("/:id", skillController.deleteSkill);
module.exports = router;