import express from "express";

import {
  getTopics,
  getPosts,
  getOnePost,
  createNormalPost,
  createReply,
} from "../controllers/Community/community.js";

const router = express.Router();

router.get("/get-topics", getTopics);
router.get("/get-topic/:slug", getPosts);
router.get("/get-one-post/:topicSlug/:postSlug", getOnePost);

router.post("/create-normal-post", createNormalPost);
router.post("/create-reply/:slug", createReply);

export default router;
