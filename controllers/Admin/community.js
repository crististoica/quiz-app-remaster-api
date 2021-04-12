import Topic from "../../models/topic.js";
import Quiz from "../../models/quiz.js";
import fs from "fs";

export const createTopic = async (req, res, next) => {
  const topicInfos = {
    name: req.body.name,
    color: req.body.color,
    img: req.file.path.replace("public\\", ""),
    url: req.body.name.toLowerCase().split(" ").join("-"),
  };

  try {
    const topic = new Topic(topicInfos);
    await topic.save();

    res.json({
      topic,
      message: "Topic Created.",
    });
  } catch (error) {
    next(error);
  }
};

export const removeTopic = async (req, res, next) => {
  const topicId = req.params.topicId;

  try {
    const topic = await Topic.findByIdAndDelete(topicId);
    if (topic.isForQuiz) {
      await Quiz.findByIdAndDelete(topic.quiz);
    }

    fs.unlink("public/" + topic.img, (err) => {
      if (err) throw new Error(err);
      let msg = "Topic Removed.";

      if (topic.isForQuiz) {
        msg = "Topic and Quiz Removed.";
      }

      res.json({
        topicId: topic._id,
        message: msg,
      });
    });
  } catch (error) {
    next(error);
  }
};

export const toggleTopicLock = async (req, res, next) => {
  const topicId = req.params.topicId;
  const newTopic = {
    ...req.body,
    isLocked: !req.body.isLocked,
  };
  const message = req.body.isLocked ? "Topic Unlocked" : "Topic Locked";

  try {
    const topic = await Topic.findByIdAndUpdate(topicId, newTopic, {
      new: true,
    });

    res.json({
      topic,
      message,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTopic = async (req, res, next) => {
  const topicId = req.params.topicId;
  const topicInfos = {
    ...req.body,
    url: req.body.name.toLowerCase().split(" ").join("-"),
  };
  res.end();
  // try {
  //   const topic = await Topic.findByIdAndUpdate(topicId, topicInfos);

  //   res.json({
  //     topic,
  //     message: "Topic Updated.",
  //   });
  // } catch (error) {
  //   next(error);
  // }
};
