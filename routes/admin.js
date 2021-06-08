import express from "express";

import {
  createTopic,
  removeTopic,
  toggleTopicLock,
  updateTopic,
  removeAllGuestRelated,
} from "../controllers/admin/community.js";
import { createQuiz } from "../controllers/admin/quizes.js";
import { uploadTopicImage, uploadQuizImage } from "../fileUpload.js";

const router = express.Router();

// community
router.post(
  "/topics/create-topic",
  uploadTopicImage.single("img"),
  createTopic
);
router.get("/remove-guest-related", removeAllGuestRelated);

router.delete("/topics/remove-topic/:topicId", removeTopic);

router.put("/topics/toggle-topic-lock/:topicId", toggleTopicLock);
router.put(
  "/topics/update-topic/:topicId",
  uploadTopicImage.single("img"),
  updateTopic
);

// quizes
router.post("/quizes/create-quiz", uploadQuizImage.single("img"), createQuiz);

export default router;
