import mongoose from "mongoose";

const TopicSchema = mongoose.Schema({
  name: String,
  img: String,
  color: String,
  slug: String,
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
      _id: mongoose.Schema.Types.ObjectId,
      author: {
        _id: mongoose.Schema.Types.ObjectId,
        name: String,
        profileImg: String,
      },
      questionId: String,
      slug: String,
      title: String,
      createdOn: Date,
    },
  ],
});

export default mongoose.model("topic", TopicSchema);
