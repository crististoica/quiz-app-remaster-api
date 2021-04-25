import slugify from "slugify";
import Topic from "../../models/topic.js";
import Post from "../../models/post.js";
import Reply from "../../models/reply.js";

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
    if (!post) {
      return res.json({ post: null });
    }
    if (post.topic.slug !== topicSlug) {
      return res.json({ post: null });
    }

    res.json({ post });
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
      throw new Error("Topic is Locked.");
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
      _id: postInfos.topicId,
      slug: postInfos.topicSlug,
    };
    await post.save();

    res.json({
      topic: topic,
      message: "Post Created.",
    });
  } catch (error) {
    console.log(error);
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
