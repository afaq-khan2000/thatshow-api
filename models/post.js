const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    // subCategoryId: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "subCategories",
    // },
    userId: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    deletedBy: { type: mongoose.Types.ObjectId, ref: "users" },
    newsType: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    clicks: { type: Number, default: 0 },
    requestDelete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
