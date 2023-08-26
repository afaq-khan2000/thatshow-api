const mongoose = require("mongoose");
const Post = require("../models/post");
const Category = require("../models/Category");
const slugify = require("slugify");

exports.getAllPosts = async function (req, res, next) {
  try {
    const posts = await Post.find()
      .populate("categoryId")
      // .populate("subCategoryId")
      .populate("deletedBy")
      .populate("userId")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

exports.getPostsByCategoryName = async function (req, res, next) {
  try {
    console.log(req.params.categoryName);
    const category = await Category.findOne({ name: req.params.categoryName });
    if (!category) return res.status(402).json("Category does not exist");
    const posts = await Post.find({ categoryId: category._id })
      .populate("categoryId")
      // .populate("subCategoryId")
      .sort({ updatedAt: -1 });
    res.status(200).json(posts);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

exports.getPostsByClicks = async function (req, res, next) {
  try {
    const posts = await Post.find()
      .populate("categoryId")
      // .populate("subCategoryId")
      .sort({ clicks: -1 })
      .limit(10);
    res.status(200).json(posts);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

exports.getSinglePost = async function (req, res, next) {
  try {
    const post = await Post.findById(req.params.id)
      .populate("categoryId")
      // .populate("subCategoryId");
    res.status(200).json(post);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

exports.addPost = async function (req, res, next) {
  const {
    userId,
    title,
    type,
    metaTitle,
    metaDescription,
    categoryId,
    // subCategoryId,
    content,
  } = req.body;
  // const image = req.files;
  const image = req.file?.filename;
  const slug = slugify(title, { lower: true });
  const post = new Post({
    newsType: type,
    metaTitle,
    metaDescription,
    categoryId,
    // subCategoryId,
    userId,
    title,
    content,
    image,
    slug,
  });
  await post.save();
  console.log("Success");
  res.status(200).send(post);
};

exports.updatePost = async function (req, res, next) {
  let {
    title,
    type,
    metaTitle,
    image,
    metaDescription,
    categoryId,
    // subCategoryId,
    content,
  } = req.body;
  let editImage = req.file?.filename;
  console.log(categoryId);
  let editData = {
    title,
    newsType: type,
    image,
    metaTitle,
    metaDescription,
    categoryId,
    // subCategoryId,
    content,
  };
  if (editImage) {
    editData = { ...editData, image: editImage };
  } else {
    editData = { ...editData, image: image };
  }
  const post = await Post.findByIdAndUpdate(req.params.id, editData);
  console.log("success");
  res.status(200).send(post);
};

exports.deletePost = async function (req, res, next) {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    res.status(200).send(post);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

exports.softDeletePost = async function (req, res, next) {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, {
      requestDelete: true,
      deletedBy: req.body.managerId,
    });
    res.status(200).send(post);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

exports.declineSoftDeletePost = async function (req, res, next) {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, {
      requestDelete: false,
      deletedBy: null,
    });
    res.status(200).send(post);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

exports.clickPost = async function (req, res, next) {
  try {
    console.log("clicked");
    const post = await Post.findById(req.params.id);
    await post.update({ clicks: post.clicks + 1 });
    res.status(200).send(post);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};
