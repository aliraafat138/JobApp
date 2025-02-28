import {applicationModel} from "../../../DB/Models/Application.Model.js";
import {asyncHandler} from "../../../Utilis/error/error.js";
import {cloud} from "../../../Utilis/multer/cloudinary.js";
import * as dbService from "../../../DB/db.service.js";
import {jobModel} from "../../../DB/Models/Job.Model.js";
import {successResponse} from "../../../Utilis/successResponse/response.js";
import {companyModel} from "../../../DB/Models/Company.Model.js";
import {emailEvent} from "../../../Utilis/email/Events/email.event.js";

export const createApplication = asyncHandler(async (req, res, next) => {
  const {jobId} = req.params;
  const job = await dbService.findOne({
    model: jobModel,
    filter: {_id: jobId},
  });
  if (!job) {
    return next(new Error("Job Not Found", {cause: 404}));
  }
  const app = await dbService.create({
    model: applicationModel,
    data: {
      userId: req.user._id,
      jobId,
    },
  });
  return successResponse({res, data: {job}});
});

export const uploadCv = asyncHandler(async (req, res, next) => {
  const {appId} = req.params;
  let cv = [];
  for (const file of req.files) {
    const {secure_url, public_id} = await cloud.uploader.upload(file.path, {
      folder: `${process.env.APP_NAME}/CV`,
    });
    cv.push({secure_url, public_id});
  }

  const UserCV = await dbService.UpdateOne({
    model: applicationModel,
    filter: {_id: appId},
    data: {
      $push: {userCV: {$each: cv}},
    },
  });
  if (UserCV.modifiedCount == 0) {
    return next(new Error("Failed To Update", {cause: 400}));
  }
  return successResponse({res, status: 201, data: {UserCV}});
});

export const getApplication = asyncHandler(async (req, res, next) => {
  const {jobId} = req.params;
  const {skip, limit} = req.query;
  const job = await dbService.findOne({
    model: jobModel,
    filter: {_id: jobId},
  });
  if (!job) {
    return next(new Error("Job Not Found ", {cause: 404}));
  }
  const jobApplication = await dbService.find({
    model: applicationModel,
    filter: {jobId},
    skip,
    limit,
    populate: [
      {
        path: "jobId",
      },
    ],
  });
  return successResponse({res, data: {jobApplication}});
});

export const applicantStatus = asyncHandler(async (req, res, next) => {
  const {appId} = req.params;
  const {status, email} = req.body;

  const app = await dbService.findOne({
    model: applicationModel,
    filter: {_id: appId},
  });
  const company = await dbService.findOne({model: companyModel});
  if (company.HRs.toString() !== req.user._id.toString()) {
    return next(new Error("You are not Authorized", {cause: 403}));
  }
  if (!app) {
    return next(new Error("Application Not Found", {cause: 404}));
  }
  const statusApp = await dbService.UpdateOne({
    model: applicationModel,
    filter: {_id: appId},
    data: {status},
  });
  if (status === "accepted") {
    emailEvent.emit("Accept", {email});
  } else {
    emailEvent.emit("Reject", {email});
  }
  if (statusApp.modifiedCount == 0) {
    return next(new Error("Fail To Update", {cause: 400}));
  }
  return successResponse({res, data: {statusApp}});
});
