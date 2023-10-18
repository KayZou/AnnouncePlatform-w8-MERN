const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const JobsSchema = new mongoose.Schema({
  title: { type: String, required: false },
  description: { type: String, required: false },
  image: { type: String, required: false },
  creator: { type: mongoose.Types.ObjectId, required: false, ref: "User" },
});
JobsSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Job", JobsSchema);
