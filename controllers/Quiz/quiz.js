import fs from "fs";

import Quiz from "../../models/quiz.js";
import { generateQuiz, generateRealTest, gradeQuiz } from "./helpers.js";

const FILE_URL = "./data-remaster-v3.json";

const getCourseKey = (course) => {
  switch (course.toLowerCase()) {
    case "java":
      return "POO";
    case "networks":
      return "RET";
    case "databases":
      return "BD";
    default:
      return null;
  }
};

export const getQuiz = (req, res, next) => {
  const key = getCourseKey(req.params.course);

  try {
    fs.readFile(FILE_URL, (error, data) => {
      if (error) throw error;
      const questionsArr = JSON.parse(data);
      if (key) {
        const questions = questionsArr[key];
        return res.json({
          key: key,
          quiz: {
            [key]: generateQuiz(questions),
          },
        });
      }

      res.json({
        key: "real test",
        quiz: generateRealTest(3, questionsArr, 4, 8),
      });
    });
  } catch (error) {
    next(error);
  }
};

export const verifyQuiz = (req, res, next) => {
  const userQuizData = req.body;
  console.log(userQuizData);
  try {
    fs.readFile(FILE_URL, (error, data) => {
      if (error) throw error;
      const questionsArr = JSON.parse(data);

      res.json({ result: gradeQuiz(questionsArr, userQuizData) });
    });
  } catch (error) {
    next(error);
  }
};

export const getQuizInfos = async (req, res, next) => {
  try {
    const quizes = await Quiz.find({});

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
