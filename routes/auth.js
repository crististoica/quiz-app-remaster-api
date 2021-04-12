import express from "express";

import { signup, signin, checkToken } from "../controllers/auth.js";
import { checkUserToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);

router.get("/check-token", checkUserToken, checkToken);

export default router;
