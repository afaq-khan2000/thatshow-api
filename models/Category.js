const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String },
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    order: { type: Number },
  },
  { timestamps: true }
);

module.exports = Category = mongoose.model(
  "categories",
  categorySchema,
  "categories"
);
