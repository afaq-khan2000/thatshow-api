const mongoose = require("mongoose");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const Post = require("../models/post");

exports.getSubCategoriesByCategory = async function (req, res) {
  try {
    let subCategories = await SubCategory.find({
      'parentCategory': {
        $in: [
          mongoose.Types.ObjectId(req.params.id)
        ]
      }
    });
    res.status(200).json(subCategories);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
exports.getSubCategoriesByCategoryName = async function (req, res, next) {
  try {
    console.log(req.params.categoryName);
    const category = await Category.findOne({ name: req.params.categoryName });
    if (!category) return res.status(402).json("Category does not exist");
    const subCategories = await SubCategory.find({ parentCategory: category._id }).sort({ updatedAt: -1 });
    res.status(200).json(subCategories);
  } catch (e) {
    res.status(404).json({ message: e.message })
  }

};

exports.getSubCategories = async function (req, res) {

  try {
    const subCategories = await SubCategory.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "parentCategory",
          foreignField: "_id",
          as: "category",
        },
      },
    ]);

    res.status(200).json(subCategories);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
exports.getSingleSubCategory = async function (req, res) {

  try {
    const subCategory = await SubCategory.findById({ _id: req.params.id })

    res.status(200).json(subCategory);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// exports.getSingleSubCategory = async function (req, res) {

//   try {
//     const subCategory = await SubCategory.findById({ _id: req.params.id });

//     res.status(200).json(subCategory);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

exports.createSubCategory = async (req, res) => {
  let { name, metaTitle, metaDescription, parentCategory } = req.body;
  const image = req.file?.filename;
  const newSubCategory = new SubCategory({
    name,
    metaTitle,
    metaDescription,
    parentCategory,
    image,
  });
  try {
    const savedSubCategory = await SubCategory.create(newSubCategory);
    res.status(200).send(savedSubCategory);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

exports.updateSubCategory = async (req, res) => {

  try {
    const image = req.file?.filename;
    const id = req.params.id;
    const subCategory = { ...req.body, image };
    const updatedSubCategory = await SubCategory.findByIdAndUpdate(id, subCategory);
    await updatedSubCategory.save();
    res.status(200).send(updatedSubCategory);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

exports.deleteSubCategory = async (req, res) => {
  try {
    const id = req.params.id;
    let subCategory = await SubCategory.findById(id);
    let posts = await Post.deleteMany({ subCategoryId: subCategory._id });
    await subCategory.delete();
    res.status(200).json({ success: true });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.deleteSubCategoryByCategory = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    await SubCategory.deleteMany({
      'parentCategory': {
        $in: [
          mongoose.Types.ObjectId(id)
        ]
      }
    });
    res.status(200).json({ success: true });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};
