const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subCategorySchema = new Schema(
  {
    name: { type: String, required: true },
    parentCategory: {
      type: mongoose.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    image: { type: String },
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = SubCategory = mongoose.model(
  "subCategories",
  subCategorySchema,
  "subCategories"
);
