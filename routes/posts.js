const express = require("express");
var multer = require("multer");
const { Base_URL } = require("../config");

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

  res.json(`${Base_URL}public/posts/` + req.file.filename);
});
router.post("/", upload.single("image"), addPost);
router.get("/", getAllPosts);
router.get("/by-category-name/:categoryName", getPostsByCategoryName);
router.get("/by-clicks", getPostsByClicks);
router.get("/:id", getSinglePost);
router.put("/:id", upload.single("editImage"), updatePost);
router.put("/soft-delete/:id", softDeletePost);
router.put("/decline-soft-delete/:id", declineSoftDeletePost);
router.post("/:id", clickPost);
router.delete("/:id", deletePost);

module.exports = router;
