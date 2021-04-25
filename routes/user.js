import express from "express";

import {
  signup,
  signin,
  checkToken,
  changeProfileImg,
} from "../controllers/User/user.js";
import { checkUserToken } from "../middleware/auth.js";
import { uploadProfileImage, uploadQuizImage } from "../fileUpload.js";

const router = express.Router();

router.get("/check-token", checkUserToken, checkToken);

router.post("/signup", signup);
router.post("/signin", signin);

router.put(
  "/change-profile-img",
  checkUserToken,
  uploadProfileImage.single("profileImg"),
  changeProfileImg
);

export default router;