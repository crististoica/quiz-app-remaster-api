import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

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
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "12h",
          }
        );

        return res.json({
          token,
          userData: existingUser,
        });
      }
    }
    throw new Error("Invalid Credentials.");
  } catch (error) {
    next(error);
  }
};

export const checkToken = (req, res) => {
  res.json(req.userData);
};
