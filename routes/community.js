import express from "express";
import rateLimit from "express-rate-limit";

import {
  getTopics,
  getPosts,
  getOnePost,
  createNormalPost,
  createQuizPost,
  createReply,
  setPostStatus,
} from "../controllers/community/community.js";

const router = express.Router();

const communityLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    message: "Too many requests. Try again in 15 minutes.",
  },
});

const postStatusToggleLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2,
  message: {
    message:
      "You've changed post status too many times. Try again in 15 minutes",
  },
});

router.get("/get-topics", getTopics);
router.get("/get-topic/:slug", getPosts);
router.get("/get-one-post/:topicSlug/:postSlug", getOnePost);

router.post("/create-normal-post", communityLimit, createNormalPost);
router.post("/create-quiz-post", communityLimit, createQuizPost);
router.post("/create-reply/:slug", communityLimit, createReply);

router.patch(
  "/set-post-status/:topicSlug/:postSlug",
  postStatusToggleLimit,
  setPostStatus
);

export default router;
