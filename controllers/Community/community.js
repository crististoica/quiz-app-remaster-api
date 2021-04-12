import Topic from "../../models/topic.js";

export const getTopics = async (req, res, next) => {
  try {
    const topics = await Topic.find({});

    res.json({ topics });
  } catch (error) {
    next(error);
  }
};
