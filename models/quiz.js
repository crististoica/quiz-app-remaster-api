import mongoose from "mongoose";

const QuizSchema = mongoose.Schema({
  name: String,
  img: String,
  color: String,
  slug: String,
  numOfQuestions: Number,
  topic: mongoose.Schema.Types.ObjectId,
  questions: [
    {
      _id: String,
      mainText: String,
      options: [
        {
          _id: String,
          text: String,
        },
      ],
      correctAnswer: String,
      questionNumber: Number,
      index: Number,
    },
  ],
});

export default mongoose.model("quiz", QuizSchema);
