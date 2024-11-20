import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  username: {
    type: String,
    require: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    require: true,
  },
  createdAT: {
    type: Date,
    default: Date.now,
  },
});
const User = mongoose.model("User", userSchema);
export default User;
