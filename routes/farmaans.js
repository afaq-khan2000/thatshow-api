const express = require("express");
const {
  createFarmaan,
  getFarmaans,
  getFarmaan,
  deleteFarmaan,
  updateFarmaan,
} = require("../controllers/farmaans");
const router = express.Router();

router.post("/", createFarmaan);
router.get("/", getFarmaans);
router.get("/:id", getFarmaan);
router.delete("/:id", deleteFarmaan);
router.put("/:id", updateFarmaan);

module.exports = router;
