const express = require("express");
const multer = require("multer");
const fs = require("fs");
const {
  createSubCategory,
  getSubCategories,
  deleteSubCategory,
  updateSubCategory,
  getSubCategoriesByCategory,
  deleteSubCategoryByCategory,
  getSingleSubCategory,
  getSubCategoriesByCategoryName,
} = require("../controllers/subCategories");
const { requireSignin } = require("../middlewares/auth.js");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file) {
      const name = req.body.name;
      if (!fs.existsSync("./uploads/subCategories/" + name)) {
        fs.mkdirSync("./uploads/subCategories/" + name);
      }
      cb(null, "uploads/subCategories/" + name);
    }
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file?.fieldname +
      "-" +
      Date.now() +
      file?.originalname.toLowerCase().split(" ").join("-")
    );
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("image"), createSubCategory);
router.get("/:id", getSubCategoriesByCategory);
router.put("/:id", upload.single("image"), updateSubCategory);
router.get("/", getSubCategories);
router.get("/single/:id", getSingleSubCategory);
router.get("/by-category-name/:categoryName", getSubCategoriesByCategoryName);
router.delete("/:id", deleteSubCategory);
router.delete("/byCategory/:id", deleteSubCategoryByCategory);

module.exports = router;
