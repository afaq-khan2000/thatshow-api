const express = require("express");
const multer = require("multer");
const fs = require("fs");
const {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
  getCategory,
  changeOrder,
} = require("../controllers/categories");
const { requireSignin } = require("../middlewares/auth.js");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file) {
      const name = req.body.name;
      if (!fs.existsSync("./uploads/categories/" + name)) {
        fs.mkdirSync("./uploads/categories/" + name);
      } else {
        try {
          fs.rmSync("./uploads/categories/" + name, { recursive: true });
          fs.mkdirSync("./uploads/categories/" + name);
        } catch (err) {
          console.error(err);
        }
      }
      cb(null, "uploads/categories/" + name);
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

router.post("/", requireSignin, upload.single("image"), createCategory);
router.get("/", getCategories);
router.get("/:id", getCategory);
router.delete("/:id", requireSignin, deleteCategory);
router.put("/:id", requireSignin, upload.single("image"), updateCategory);
router.put("/change-order/:id", requireSignin, changeOrder);

module.exports = router;
