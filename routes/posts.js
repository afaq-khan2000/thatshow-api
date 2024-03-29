const express = require("express");
var multer = require("multer");
const { Base_URL } = require("../config");
const { requireSignin } = require("../middlewares/auth.js");

const {
  getAllPosts,
  addPost,
  getSinglePost,
  updatePost,
  deletePost,
  getPostsByCategoryName,
  clickPost,
  getPostsByClicks,
  sofeDeletePost,
  softDeletePost,
  declineSoftDeletePost,
} = require("../controllers/posts");
const router = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/posts");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), (req, res) => {
  console.log("starting upload...", req.file);

  res.json(`public/posts/` + req.file.filename);
});
router.post("/", requireSignin, upload.single("image"), addPost);
router.get("/", getAllPosts);
router.get("/by-category-name/:categoryName", getPostsByCategoryName);
router.get("/by-clicks", getPostsByClicks);
router.get("/:id", getSinglePost);
router.put("/:id", requireSignin, upload.single("editImage"), updatePost);
router.put("/soft-delete/:id", requireSignin, softDeletePost);
router.put("/decline-soft-delete/:id", requireSignin, declineSoftDeletePost);
router.post("/:id", clickPost);
router.delete("/:id", requireSignin, deletePost);

module.exports = router;
