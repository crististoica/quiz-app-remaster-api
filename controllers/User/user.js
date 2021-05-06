import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sharp from "sharp";
import fs from "fs";

import User from "../../models/user.js";

export const signup = async (req, res, next) => {
  const userInfo = req.body;
  console.log(userInfo);
  try {
    const existingEmail = await User.findOne({ email: userInfo.email });
    if (existingEmail) {
      throw new Error("Email already in use.");
    }

    if (userInfo.password !== userInfo.confirmPassword) {
      throw new Error("Passwords do not match.");
    }
    const hashedPassword = await bcrypt.hash(userInfo.password, 10);
    userInfo.password = hashedPassword;
    const user = new User(userInfo);
    const newUser = await user.save();

    const token = jwt.sign(
      {
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        profileImg: newUser.profileImg,
        isAdmin: newUser.isAdmin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "12h",
      }
    );
    res.json({
      token,
      userData: newUser,
      message: {
        content: "Successfully registered.",
        type: "success",
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const credentials = req.body;

  try {
    const existingUser = await User.findOne({ email: credentials.email });
    if (existingUser) {
      const correctPassword = await bcrypt.compare(
        credentials.password,
        existingUser.password
      );

      if (correctPassword) {
        const token = jwt.sign(
          {
            _id: existingUser._id,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            profileImg: existingUser.profileImg,
            isAdmin: existingUser.isAdmin,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "12h",
          }
        );

        return res.json({
          token,
          userData: {
            _id: existingUser._id,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            profileImg: existingUser.profileImg,
            isAdmin: existingUser.isAdmin,
          },
        });
      }
    }
    throw new Error("Invalid Credentials.");
  } catch (error) {
    next(error);
  }
};

export const changeProfileImg = async (req, res, next) => {
  const path = req.file.path;
  const userId = req.userData._id;

  const image = await sharp(path)
    .resize(200, 200)
    .png()
    .toFile(`public/uploads/profiles/${userId}.png`);

  await User.findByIdAndUpdate(userId, {
    profileImg: `uploads/profiles/${userId}.png`,
  });

  fs.unlink(path, (err) => {
    if (err) throw new Error(err);

    res.json({
      message: "Profile Image Updated.",
    });
  });
};

export const checkToken = (req, res) => {
  console.log(req.userData);
  res.json(req.userData);
};
