import {asyncHandler} from "../../../Utilis/error/error.js";
import * as dbService from "../../../DB/db.service.js";
import {successResponse} from "../../../Utilis/successResponse/response.js";
import {jobModel} from "../../../DB/Models/Job.Model.js";
import {companyModel} from "../../../DB/Models/Company.Model.js";
export const createJob = asyncHandler(async (req, res, next) => {
  const {companyId} = req.params;
  const company = await dbService.findOne({
    model: companyModel,
    filter: {_id: companyId},
  });
  if (!company) {
    return next(new Error("Company Not Found ", {cause: 404}));
  }
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  } = req.body;

  const job = await dbService.create({
    model: jobModel,
    data: {
      companyId,
      jobTitle,
      jobDescription,
      jobLocation,
      seniorityLevel,
      softSkills,
      technicalSkills,
      workingTime,
      addedBy: req.user._id,
    },
  });
  return successResponse({res, data: {job}});
});

export const updateJob = asyncHandler(async (req, res, next) => {
  const {jobId} = req.params;
  const job = await dbService.findOne({
    model: jobModel,
    filter: {
      _id: jobId,
    },
  });
  if (!job) {
    return next(new Error("Job Not Found", {cause: 404}));
  }

  const updatedJob = await dbService.UpdateOne({
    model: jobModel,
    filter: {addedBy: req.user._id},
    data: req.body,
  });
  if (updatedJob.modifiedCount == 0) {
    return next(new Error("Fail To Update", {cause: 400}));
  }
  return successResponse({res, data: {updatedJob}});
});

export const deleteJob = asyncHandler(async (req, res, next) => {
  const {jobId} = req.params;
  const job = await dbService.findOne({
    model: jobModel,
    filter: {_id: jobId},
  });
  if (!job) {
    return next(new Error("Job Not Found", {cause: 404}));
  }
  const company = await dbService.findOne({model: companyModel});
  if (company.HRs.toString() !== req.user._id.toString()) {
    return next(new Error("You Are Not Authorized To delete", {cause: 403}));
  }
  const deletedJob = await jobModel.deleteOne({
    _id: jobId,
  });
  if (deletedJob.modifiedCount == 0) {
    return next(new Error("Fail to delete", {cause: 400}));
  }
  return successResponse({res});
});

export const getJobs = asyncHandler(async (req, res, next) => {
  const {jobId} = req.params;
  const {companyName, skip, limit} = req.query;
  const job = await dbService.find({
    model: jobModel,
    // filter: {_id: jobId},  if need to search for specificOne add id to controller
    populate: [
      {
        path: "companyId",
        select: "companyName",
      },
    ],
    skip,
    limit,
  });
  if (!job) {
    return next(new Error("Job Not Found", {cause: 404}));
  }
  return successResponse({res, data: {job}});
});

export const filteredJobs = asyncHandler(async (req, res, next) => {
  const {jobId} = req.params;
  const {
    companyName,
    skip,
    workingTime,
    jobLocation,
    seniorityLevel,
    jobTitle,
    technicalSkills,
    limit,
  } = req.query;
  const job = await dbService.find({
    model: jobModel,
    // filter: {_id: jobId},  if need to search for specificOne add id to controller
    populate: [
      {
        path: "companyId",
        select: "companyName",
      },
    ],
    skip,
    limit,
  });
  if (!job) {
    return next(new Error("Job Not Found", {cause: 404}));
  }
  return successResponse({res, data: {job}});
});
