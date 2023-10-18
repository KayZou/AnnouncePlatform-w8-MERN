require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const secretKey = process.env.JWT_SECRET_KEY;
const HttpErrors = require("../middlewares/http-errors");
const { validationResult } = require("express-validator");
const User = require("../models/users.model");

const signUp = async (req, res, next) => {
  const { username, email, password, image } = req.body;
  try {
    const isUser = await User.findOne({ email });
    if (isUser) {
      const error = new HttpErrors("user already exists!", 422);
      return next(error);
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const createdUser = await User.create({
      username,
      email,
      image,
      password: hashedPassword,
      places: [],
    });
    if (!createdUser) {
      res.json({
        message: "can't create user!",
      });
    }
    res.status(200).json({
      status: "success",
      data: createdUser.toObject({ getters: true }),
    });
  } catch (err) {
    console.log(err.message);
    const error = new HttpErrors("Can't sign up!", 404);
    next(error);
  }
};
const loginIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const isUser = await User.findOne({ email });
    if (!isUser) {
      const error = new HttpErrors("user doesn't exist", 404);
      return next(error);
    }
    const validPassword = await bcrypt.compare(password, isUser.password);
    if (!validPassword) {
      const error = new HttpErrors("password is not correct", 404);
      return next(error);
    }
    const token = jwt.sign({ isUser }, secretKey, {
      expiresIn: "1h",
    });

    res.status(200).json({
      token,
    });
  } catch (err) {
    console.log(err.message);
    const error = new HttpErrors("can't login!", 404);
  }
};
const allUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, "-password");
    if (!users) {
      const error = new HttpErrors("can't find all users!", 404);
      return next(error);
    }
    res.status(200).json({
      status: "success",
      data: users.map((user) => {
        return user.toObject({ getters: true });
      }),
    });
  } catch (err) {
    console.log(err.message);
    const error = new HttpErrors("can't retrieve all users!", 404);
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  const uid = req.params.uid;
  try {
    const user = await User.findById(uid);
    res.json({
      status: "success",
      data: user.toObject({ getters: true }),
    });
  } catch (err) {
    const error = new HttpErrors("Couldn't find this place!", 404);
    return next(error);
  }
};

module.exports = {
  signUp,
  loginIn,
  allUsers,
  getUserById,
};
