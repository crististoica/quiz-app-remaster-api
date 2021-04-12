import Quiz from "../../models/quiz.js";
import Topic from "../../models/topic.js";
import fs from "fs";

export const createQuiz = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error("An Image Is Required.");
    }

    const quizInfos = {
      ...req.body,
      img: req.file.path.replace("public\\", ""),
      url: req.body.name.toLowerCase().split(" ").join("-"),
    };

    const topicInfos = {
      name: req.body.name,
      color: req.body.color,
      img: req.file.path.replace("public\\", ""),
      url: req.body.name.toLowerCase().split(" ").join("-"),
    };

    const quiz = new Quiz(quizInfos);
    const topic = new Topic(topicInfos);

    quiz.topic = topic._id;
    topic.quiz = quiz._id;
    topic.isForQuiz = true;

    const savedQuiz = await quiz.save();
    const savedTopic = await topic.save();

    res.json({
      quiz: savedQuiz,
      topic: savedTopic,
      message: "Quiz and Topic created.",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
