import slugify from "slugify";
import Topic from "../../models/topic.js";
import Post from "../../models/post.js";
import Reply from "../../models/reply.js";
import Quiz from "../../models/quiz.js";

export const getTopics = async (req, res, next) => {
  try {
    const topics = await Topic.find({});

    res.json({ topics });
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  const slug = req.params.slug;
  try {
    const topic = await Topic.findOne({ slug });

    res.json(topic);
  } catch (error) {
    next(error);
  }
};

export const getOnePost = async (req, res, next) => {
  const { topicSlug, postSlug } = req.params;

  try {
    const post = await Post.findOne({ slug: postSlug });
    const topic = await Topic.findOne({ slug: topicSlug });
    if (!post) {
      return res.json({ post: null });
    }
    if (post.topic.slug !== topicSlug) {
      return res.json({ post: null });
    }

    res.json({ post, topic });
  } catch (error) {
    next(error);
  }
};

export const createNormalPost = async (req, res, next) => {
  const userData = req.userData;
  const postInfos = {
    ...req.body,
    queryTitle: req.body.title,
    author: {
      _id: userData._id,
      name: userData.firstName + " " + userData.lastName,
      profileImg: userData.profileImg,
    },
    createdOn: Date.now(),
    slug: slugify(req.body.title, {
      lower: true,
      strict: true,
    }),
  };

  try {
    if (postInfos.questionContent) {
      const quiz = await Quiz.findById(quizId);

      if (!quiz) {
        throw new Error("This quiz does not exist.");
      }

      const question = quiz.questions.find((q) => q._id === questionId);
      if (!question) {
        throw new Error("This question does not exist.");
      }
    }

    if (postInfos.title.length < 4) {
      throw new Error("Post title must be at least 4 chars long.");
    }
    if (postInfos.content.length < 10) {
      throw new Error("Post content must be at least 10 chars long.");
    }

    const existingTopic = await Topic.findById(postInfos.topicId);
    if (!existingTopic) {
      throw new Error("This topic does not exist.");
    }
    if (existingTopic.isForQuiz) {
      throw new Error("This topic is for quizes.");
    }
    if (existingTopic.isLocked) {
      throw new Error("Topic is Locked (refresh the page).");
    }

    const existingPost = await Post.findOne({
      slug: postInfos.slug,
    });

    if (existingPost) {
      throw new Error("There is already a post with this title.");
    }

    const post = new Post(postInfos);

    const topic = await Topic.findByIdAndUpdate(
      postInfos.topicId,
      {
        $push: {
          posts: {
            _id: post._id,
            author: {
              _id: userData._id,
              name: userData.firstName + " " + userData.lastName,
              profileImg: userData.profileImg,
            },
            title: postInfos.title,
            slug: postInfos.slug,
            createdOn: Date.now(),
          },
        },
      },
      { new: true }
    );

    post.topic = {
      _id: topic._id,
      slug: topic.slug,
    };
    await post.save();

    res.json({
      topic: topic,
      message: "Post Created.",
    });
  } catch (error) {
    next(error);
  }
};

export const createReply = async (req, res, next) => {
  const { slug } = req.params;
  const userData = req.userData;
  const replyInfos = {
    ...req.body,
    author: {
      _id: userData._id,
      name: userData.firstName + " " + userData.lastName,
      profileImg: userData.profileImg,
    },
    createdOn: Date.now(),
  };

  try {
    if (replyInfos.content.length < 4) {
      throw new Error("Reply must be at least 4 chars long.");
    }
    const reply = new Reply(replyInfos);
    const post = await Post.findOneAndUpdate(
      { slug },
      { $push: { replies: reply } }
    );

    if (!post) {
      throw new Error("This post does not exist.");
    }

    res.json({
      reply,
      message: "Reply added.",
    });
  } catch (error) {
    next(error);
  }
};

export const createQuizPost = async (req, res, next) => {
  const { quizId, questionId } = req.body;
  const userData = req.userData;
  const postInfos = {
    color: req.body.color,
    author: {
      _id: userData._id,
      name: userData.firstName + " " + userData.lastName,
      profileImg: userData.profileImg,
    },
    createdOn: Date.now(),
    content: req.body.content,
  };
  console.log(questionId);
  try {
    if (postInfos.content.length < 10) {
      throw new Error("Post content must be at least 10 chars long.");
    }

    const postExists = await Post.findOne({
      "questionContent._id": questionId,
    });

    if (postExists) {
      throw new Error("There is already a post for this question.");
    }

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      throw new Error("This quiz does not exist.");
    }
    // use this to set title and other informations needed for the post
    const question = quiz.questions.find((q) => q._id === questionId);
    if (!question) {
      throw new Error("This question does not exist.");
    }
    const existingTopic = await Topic.findById(quiz.topic);
    if (!existingTopic) {
      throw new Error("This topic does not exist.");
    }
    if (!existingTopic.isForQuiz) {
      throw new Error("This topic is not for quizes.");
    }
    if (existingTopic.isLocked) {
      throw new Error("Topic is Locked (refresh the page).");
    }

    postInfos.questionContent = req.body.questionContent;
    postInfos.title = "Question " + question.questionNumber;
    postInfos.slug = slugify(postInfos.title, {
      lower: true,
      strict: true,
    });
    const post = new Post(postInfos);
    // return this
    // on frontend, push it to the posts list
    const topic = await Topic.findByIdAndUpdate(
      quiz.topic, // _id
      {
        $push: {
          posts: {
            _id: post._id,
            author: {
              _id: userData._id,
              name: userData.firstName + " " + userData.lastName,
              profileImg: userData.profileImg,
            },
            questionId: questionId,
            title: postInfos.title,
            slug: postInfos.slug,
            createdOn: Date.now(),
          },
        },
      },
      { new: true }
    );

    post.topic = {
      _id: topic._id,
      slug: topic.slug,
    };
    await post.save();

    res.json({
      topic,
      message: "Post Created.",
    });
  } catch (error) {
    next(error);
  }
};
