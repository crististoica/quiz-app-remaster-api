import mongoose from "mongoose";
import { ReplySchema } from "./reply.js";

const PostSchema = mongoose.Schema({
  title: String,
  queryTitle: {
    type: String,
    lowercase: true,
    trim: true,
  },
  content: String,
  questionContent: {},
  color: String,
  topic: {
    _id: mongoose.Schema.Types.ObjectId,
    slug: String,
  },
  slug: String,
  author: {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    profileImg: String,
    isGuest: Boolean,
  },
  createdOn: Date,
  replies: [ReplySchema],
});

export default mongoose.model("post", PostSchema);
