import express from "express";

import { getTopics } from "../controllers/Community/community.js";

const router = express.Router();

router.get("/get-topics", getTopics);

export default router;
