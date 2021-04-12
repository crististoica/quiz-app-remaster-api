import mongoose from "mongoose";

const TopicSchema = mongoose.Schema({
  name: String,
  img: String,
  color: String,
  url: String,
  isForQuiz: {
    type: Boolean,
    default: false,
  },
  quiz: mongoose.Schema.Types.ObjectId,
  isLocked: {
    type: Boolean,
    default: false,
  },
  posts: [
    {
      postId: mongoose.Schema.Types.ObjectId,
      name: String,
      createdOn: Date,
    },
  ],
});

export default mongoose.model("topic", TopicSchema);
