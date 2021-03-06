import fs from "fs";

import Quiz from "../../models/quiz.js";
import Topic from "../../models/topic.js";
import { generateQuiz, gradeQuiz } from "./helpers.js";

const FILE_URL = "./data-remaster-v3.json";

export const getQuiz = async (req, res, next) => {
  const quizId = req.params.quizId;

  try {
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      throw new Error("This quiz does not exist.");
    }

    if (quiz.questions.length === 0) {
      throw new Error("There are no questions for this quiz yet.");
    }

    const quizQuestions = generateQuiz(quiz.questions, quiz.numOfQuestions);

    res.json({
      quiz: {
        _id: quiz._id,
        slug: quiz.slug,
        color: quiz.color,
        questions: quizQuestions,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyQuiz = async (req, res, next) => {
  const userQuizData = req.body;

  try {
    const quiz = await Quiz.findById(userQuizData.quizId).lean();
    const topic = await Topic.findById(quiz.topic, "isForQuiz isLocked posts");

    res.json({ result: gradeQuiz(quiz.questions, userQuizData), topic });
  } catch (error) {
    next(error);
  }
};

export const getQuizInfos = async (req, res, next) => {
  try {
    const quizes = await Quiz.find({}, "-questions");

    res.json({
      quizes,
    });
  } catch (error) {
    next(error);
  }
};

export const viewData = (req, res, next) => {
  const spec = req.params.spec;

  try {
    fs.readFile(FILE_URL, (error, data) => {
      if (error) throw error;
      const questionsArr = JSON.parse(data);

      res.json({
        data: questionsArr[spec],
      });
    });
  } catch (error) {
    next(error);
  }
};

export const moveData = async (req, res, next) => {
  try {
    const rawData = fs.readFileSync(FILE_URL);
    const data = JSON.parse(rawData);
    data["RET"].forEach((entry) => {
      entry.mainText = entry.question;
      entry._id = entry.id;
      delete entry.question;
      delete entry.id;
    });
    const quiz = await Quiz.findById("6076b6397d62ec2ac41c40b6");
    quiz.questions = data["RET"];
    await Quiz.findByIdAndUpdate("6076b6397d62ec2ac41c40b6", quiz);

    res.json(quiz.questions);
  } catch (error) {
    next(error);
  }
};
