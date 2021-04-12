import express from "express";

import {
  getQuiz,
  verifyQuiz,
  getQuizInfos,
  viewData,
} from "../controllers/Quiz/quiz.js";

const router = express.Router();

router.get("/get-quizes", getQuizInfos);
router.get("/get-quiz/:course", getQuiz);
router.get("/view-data/:spec", viewData);

router.post("/verify-quiz", verifyQuiz);

export default router;
