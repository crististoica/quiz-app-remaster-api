import express from "express";

import {
  getQuiz,
  verifyQuiz,
  getQuizInfos,
  viewData,
  moveData,
} from "../controllers/quiz/quiz.js";

const router = express.Router();

router.get("/get-quizes", getQuizInfos);
router.get("/get-quiz/:quizId", getQuiz);
router.get("/view-data/:spec", viewData);
router.get("/move-data", moveData);

router.post("/verify-quiz", verifyQuiz);

export default router;
