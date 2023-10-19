require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const secretKey = process.env.JWT_SECRET_KEY;
const HttpErrors = require("../middlewares/http-errors");
const mongoose = require("mongoose");
const Job = require("../models/jobs.model");
const User = require("../models/users.model");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({});
  if (!jobs) {
    throw new HttpErrors("Couldn't retrieve jobs", 404);
  }
  res.status(200).json({
    status: "success",
    data: jobs,
  });
};
const createJob = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { title, description } = req.body;
  const userId = req.user.isUser._id;
  try {
    let user;

    try {
      user = await User.findById(userId);

      if (!user) {
        const error = new HttpErrors("The user id is not valid", 404);
        return next(error);
      }
    } catch (err) {
      console.error(err.message);
      const error = new HttpErrors(
        "Can't create the job due to invalid user id",
        404,
      );
      return next(error);
    }

    const session = await mongoose.startSession();

    session.startTransaction();

    const createdJob = new Job({
      title,
      description,
      creator: userId,
    });

    try {
      await createdJob.save({ session });
      user.jobs.push(createdJob);
      await user.save({ session });
      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      console.error(err.message);
      await session.abortTransaction();
      session.endSession();
      const error = new HttpErrors("Can't create the job due to an error", 500);
      return next(error);
    }

    res.status(201).json({
      status: "success",
      data: createdJob.toObject({ getters: true }),
    });
  } catch (err) {
    console.error(err.message);
    const error = new HttpErrors("Couldn't create this place!", 500);
    return next(error);
  }
};

const getJobsByUserId = async (req, res, next) => {
  const uid = req.params.uid;
  try {
    const user8jobs = await User.findById(uid).populate("jobs");
    console.log(user8jobs);

    if (!user8jobs || user8jobs.jobs.length === 0) {
      return next(new HttpErrors("user has no jobs!", 404));
    }
    res.status(200).json({
      status: "success",
      data: user8jobs.jobs.map((p) => p.toObject({ getters: true })),
    });
  } catch (err) {
    console.log(err.message);
    const error = new HttpErrors("Fetching jobs is not working!", 404);
    next(error);
  }
};

const deleteJob = async (req, res, next) => {
  const jid = req.params.jid;
  let job2delete;

  try {
    job2delete = await Job.findById(jid).populate("creator");

    if (!job2delete) {
      const error = new HttpErrors("Couldn't find this job!", 404);
      return next(error);
    }
  } catch (err) {
    console.error(err.message);
    const error = new HttpErrors("Couldn't delete this job!", 500);
    return next(error);
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await job2delete.deleteOne({ session });
    job2delete.creator.jobs.pull(jid);
    await job2delete.creator.save({ session });
    await session.commitTransaction();
    session.endSession();
    res.status(204).end();
  } catch (err) {
    console.error(err.message);
    const error = new HttpErrors("Something went wrong!", 500);
    return next(error);
  }
};

const getJobById = async (req, res, next) => {
  const jid = req.params.jid;
  try {
    const job = await Job.findById(jid);
    res.json({
      status: "success",
      data: job.toObject({ getters: true }),
    });
  } catch (err) {
    const error = new HttpErrors("Couldn't find this place!", 404);
    return next(error);
  }
};
module.exports = {
  getAllJobs,
  createJob,
  getJobsByUserId,
  deleteJob,
  getJobById,
};
