import mongoose from "mongoose";

export const ReplySchema = mongoose.Schema({
  author: {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    profileImg: String,
  },
  createdOn: Date,
  content: String,
});

export default mongoose.model("reply", ReplySchema);
