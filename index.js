import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

import { notFound, errorHandler } from "./errorHandler.js";
import { checkUserToken, checkAdminToken } from "./middleware/auth.js";
import userRouter from "./routes/user.js";
import quizRouter from "./routes/quiz.js";
import adminRouter from "./routes/admin.js";
import communityRouter from "./routes/community.js";

const app = express();
dotenv.config();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ extended: true, limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

await mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

app.use("/user", userRouter);
app.use("/quiz", quizRouter);
app.use("/community", checkUserToken, communityRouter);
app.use("/admin", checkAdminToken, adminRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
