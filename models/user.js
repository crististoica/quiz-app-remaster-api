import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  profileImg: {
    type: String,
    default: "",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isGuest: {
    type: Boolean,
    default: true,
  },
  email: String,
  password: String,
});

export default mongoose.model("user", userSchema);
