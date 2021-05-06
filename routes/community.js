import express from "express";

import {
  getTopics,
  getPosts,
  getOnePost,
  createNormalPost,
  createQuizPost,
  createReply,
} from "../controllers/community/community.js";

const router = express.Router();

router.get("/get-topics", getTopics);
router.get("/get-topic/:slug", getPosts);
router.get("/get-one-post/:topicSlug/:postSlug", getOnePost);

router.post("/create-normal-post", createNormalPost);
router.post("/create-quiz-post", createQuizPost);
router.post("/create-reply/:slug", createReply);

export default router;
