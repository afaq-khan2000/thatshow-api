const mongoose = require("mongoose");
const Category = require("../models/Category");
const Post = require("../models/post");
const SubCategory = require("../models/SubCategory");

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.getCategory = async (req, res) => {
  const id = req.params.id;
  try {
    const category = await Category.findById(id);
    res.status(200).json(category);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  let { name, metaTitle, metaDescription } = req.body;
  let order = (await Category.countDocuments()) + 1;
  const image = req.file?.filename;
  const newCategory = new Category({
    name,
    metaTitle,
    metaDescription,
    image,
    order,
  });
  try {
    const savedCategory = await Category.create(newCategory);
    res.status(200).send(savedCategory);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const image = req.file?.filename;
    console.log(image);
    const id = req.params.id;
    console.log(req.body);
    const category = { ...req.body, image };
    const updatedCategory = await Category.findByIdAndUpdate(id, category);
    await updatedCategory.save();
    res.status(200).send(updatedCategory);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    let category = await Category.findById(id);
    let subCategories = await SubCategory.deleteMany({
      parentCategory: category._id,
    });
    let posts = await Post.deleteMany({ categoryId: category._id });
    let categories = await Category.find({
      order: { $gt: category.order },
    });
    categories.map(
      async (category) =>
        await Category.updateOne(
          { _id: category._id },
          { order: category.order - 1 }
        )
    );
    await category.delete();
    res.status(200).json({ success: true });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.changeOrder = async (req, res) => {
  const id = req.params.id;
  let total = await Category.countDocuments();
  let categories;
  let { source, destination } = { ...req.body };
  try {
    if (destination == total || source == 1) {
      categories = await Category.find({
        order: { $lte: destination, $gt: source },
      });
      categories.map(
        async (category) =>
          await Category.updateOne(
            { _id: category._id },
            { order: category.order - 1 }
          )
      );
    } else {
      categories = await Category.find({
        order: { $gte: destination, $lt: source },
      });
      categories.map(
        async (category) =>
          await Category.updateOne(
            { _id: category._id },
            { order: category.order + 1 }
          )
      );
    }
    await Category.findByIdAndUpdate(id, {
      order: destination,
    });
    // console.log(categories[0]);
    return res.status(200);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
