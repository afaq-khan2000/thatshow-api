const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.statics.getAll = async (_id) => {
  const user = await User.find();
  return user;
};

userSchema.statics.getById = async (_id) => {
  const user = await User.findOne({
    _id: mongoose.Types.ObjectId(_id),
  });
  return user;
};

module.exports = User = mongoose.model("users", userSchema, "users");
