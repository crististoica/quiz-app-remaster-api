import multer from "multer";
import path from "path";
import { v4 as uuid4 } from "uuid";

const topicStorage = multer.diskStorage({
  destination: (req, file, next) => {
    next(null, "./public/uploads/topics");
  },
  filename: (req, file, next) => {
    console.log(file);
    next(
      null,
      file.fieldname + "-" + uuid4() + path.extname(file.originalname)
    );
  },
});

const quizStorage = multer.diskStorage({
  destination: (req, file, next) => {
    next(null, "./public/uploads/quizes");
  },
  filename: (req, file, next) => {
    next(
      null,
      file.fieldname + "-" + uuid4() + path.extname(file.originalname)
    );
  },
});

const checkImage = (file, next) => {
  const fileTypes = /jpeg|jpg|png|/;

  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  if (extName && mimeType) {
    return next(null, true);
  }

  return next(new Error("Images only"));
};

export const uploadTopicImage = multer({
  storage: topicStorage,
  limits: {
    fileSize: 1024 * 1024 * 10,
    files: 1,
  },
  fileFilter: (req, file, next) => {
    checkImage(file, next);
  },
});

export const uploadQuizImage = multer({
  storage: quizStorage,
  limits: {
    fileSize: 1024 * 1024 * 10,
    files: 1,
  },
  fileFilter: (req, file, next) => {
    checkImage(file, next);
  },
});
