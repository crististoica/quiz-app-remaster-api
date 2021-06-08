import express from "express";
import rateLimit from "express-rate-limit";

import {
  signup,
  signin,
  checkToken,
  changeProfileImg,
  guestSignIn,
} from "../controllers/user/user.js";
import { checkUserToken } from "../middleware/auth.js";
import { uploadProfileImage } from "../fileUpload.js";

const router = express.Router();

const registerLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    message: {
      content: "Too many requests. Try again in 15 minutes.",
      type: "error",
    },
  },
});

router.get("/check-token", checkUserToken, checkToken);

// router.post("/signup", registerLimit, signup);
router.post("/signin", signin);
router.post("/guest-signin", guestSignIn);

router.put(
  "/change-profile-img",
  checkUserToken,
  uploadProfileImage.single("profileImg"),
  changeProfileImg
);

export default router;
