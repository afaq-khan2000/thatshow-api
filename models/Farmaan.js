const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const farmaanSchema = new Schema(
  {
    title: { type: String, required: true },
    farmaan: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = Farmaan = mongoose.model(
  "farmaans",
  farmaanSchema,
  "farmaans"
);
