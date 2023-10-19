const express = require("express");
const logger = require("../middlewares/logger");
const router = express.Router();

const { check } = require("express-validator");
const jobsController = require("../controllers/jobs-controller");

router.route("/").get(jobsController.getAllJobs);
router.post(
  "/create",
  check("title").not().isEmpty(),
  check("description").not().isEmpty(),
  logger.verifyToken,
  jobsController.createJob,
);

router
  .route("/:jid")
  .delete(logger.verifyToken, jobsController.deleteJob)
  .get(jobsController.getJobById);

router
  .route("/user/:uid")
  .get(logger.verifyToken, jobsController.getJobsByUserId);

module.exports = router;
