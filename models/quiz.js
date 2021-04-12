import mongoose from "mongoose";

const QuizSchema = mongoose.Schema({
  name: String,
  img: String,
  color: String,
  key: String,
  numOfQuestions: Number,
  topic: mongoose.Schema.Types.ObjectId,
});

export default mongoose.model("quiz", QuizSchema);
