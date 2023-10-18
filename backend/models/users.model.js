const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: false },
  email: { type: String, required: false, unique: true },
  password: { type: String, minlength: 6, required: false },
  image: { type: String },
  jobs: [{ type: mongoose.Types.ObjectId, ref: "Job", required: false }],
});

UserSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", UserSchema);
