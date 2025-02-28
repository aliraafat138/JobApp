import {companyModel} from "../../../DB/Models/Company.Model.js";
import {asyncHandler} from "../../../Utilis/error/error.js";
import * as dbService from "../../../DB/db.service.js";
import {successResponse} from "../../../Utilis/successResponse/response.js";
import {cloud} from "../../../Utilis/multer/cloudinary.js";
import {roleTypes} from "../../../DB/Models/User.Model.js";
export const createCompany = asyncHandler(async (req, res, next) => {
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
  } = req.body;

  if (await companyModel.findOne({companyName, companyEmail})) {
    return next(new Error("Company Exist", {cause: 409}));
  }
  const company = await dbService.create({
    model: companyModel,
    data: {
      companyName,
      description,
      companyEmail,
      industry,
      address,
      numberOfEmployees,
      createdBy: req.user._id,
    },
  });
  return successResponse({res, data: {company}, status: 201});
});

export const updateCompany = asyncHandler(async (req, res, next) => {
  const {companyId} = req.params;
  const company = await dbService.findOne({
    model: companyModel,
    filter: {_id: companyId},
  });
  if (!company) {
    return next(new Error("Company Not Found", {cause: 404}));
  }
  if (company.createdBy.toString() !== req.user._id.toString()) {
    return next(new Error("You are not accessed to update ", {cause: 403}));
  }
  const updatedCompany = await dbService.UpdateOne({
    model: companyModel,
    filter: {createdBy: req.user._id, deletedAt: {$exists: false}},
    data: {...req.body},
  });
  if (updatedCompany.modifiedCount == 0) {
    return next(new Error("Failed to update company", {cause: 400}));
  }
  return successResponse({res, data: {updatedCompany}});
});

export const SoftDeleteCompany = asyncHandler(async (req, res, next) => {
  const {companyId} = req.params;
  const company = await dbService.findOne({
    model: companyModel,
    filter: {_id: companyId},
  });
  if (!company) {
    return next(new Error("Company Not Found", {cause: 404}));
  }
  if (company.createdBy.toString() !== req.user._id.toString()) {
    return next(new Error("You are not accessed to delete ", {cause: 403}));
  }
  const updatedCompany = await dbService.UpdateOne({
    model: companyModel,
    filter: {createdBy: req.user._id, deletedAt: {$exists: false}},
    data: {deletedAt: Date.now()},
  });
  if (updatedCompany.modifiedCount == 0) {
    return next(new Error("Failed to update company", {cause: 400}));
  }
  return successResponse({res, data: {updatedCompany}});
});

export const companyData = asyncHandler(async (req, res, next) => {
  const {companyId} = req.params;
  const company = await dbService.findOne({
    model: companyModel,
    filter: {_id: companyId, deletedAt: {$exists: false}},
    populate: {
      path: "jobs",
    },
  });
  if (!company) {
    return next(new Error("Company Not Found", {cause: 404}));
  }
  return successResponse({res, data: {company}});
});

export const specificCompany = asyncHandler(async (req, res, next) => {
  const {companyName} = req.query;
  const company = await dbService.findOne({
    model: companyModel,
    filter: {companyName, deletedAt: {$exists: false}},
  });
  if (!company) {
    return next(new Error("Company Not Found", {cause: 404}));
  }
  return successResponse({res, data: {company}});
});

export const companyLogo = asyncHandler(async (req, res, next) => {
  const {companyId} = req.params;
  let logo = [];
  for (const file of req.files) {
    const {secure_url, public_id} = await cloud.uploader.upload(file.path, {
      folder: `${process.env.APP_NAME}/logo`,
    });
    logo.push({secure_url, public_id});
  }

  const logoPic = await dbService.UpdateOne({
    model: companyModel,
    filter: {_id: companyId, deletedAt: {$exists: false}},
    data: {
      $push: {Logo: {$each: logo}},
    },
  });
  if (logoPic.modifiedCount == 0) {
    return next(new Error("Filed To Update", {cause: 400}));
  }
  return successResponse({res, status: 201, data: {logoPic}});
});

export const coverCompanyLogo = asyncHandler(async (req, res, next) => {
  const {companyId} = req.params;
  let cover = [];
  for (const file of req.files) {
    const {secure_url, public_id} = await cloud.uploader.upload(file.path, {
      folder: `${process.env.APP_NAME}/coverLogo`,
    });
    cover.push({secure_url, public_id});
  }

  const coverPic = await dbService.UpdateOne({
    model: companyModel,
    filter: {_id: companyId, deletedAt: {$exists: false}},
    data: {
      $push: {coverPic: {$each: cover}},
    },
  });
  if (coverPic.modifiedCount == 0) {
    return next(new Error("Filed To Update", {cause: 400}));
  }
  return successResponse({res, status: 201, data: {coverPic}});
});
export const deleteCompanyLogo = asyncHandler(async (req, res, next) => {
  const {logoId} = req.params;
  const logo = await dbService.findOne({
    model: companyModel,
    filter: {_id: req.user._id, "Logo._id": logoId},
  });
  if (!logo) {
    return next(new Error("Logo Not Found", {cause: 404}));
  }

  const deletedLogo = await dbService.UpdateOne({
    model: companyModel,
    filter: {_id: req.user._id},
    data: {$pull: {Logo: {_id: logoId}}},
  });
  if (deletedLogo.modifiedCount == 0) {
    return next(new Error("Failed To Delete", {cause: 400}));
  }
  return successResponse({res});
});

export const deleteCompanyCoverLogo = asyncHandler(async (req, res, next) => {
  const {logoId} = req.params;
  const logo = await dbService.findOne({
    model: companyModel,
    filter: {_id: req.user._id, "coverPic._id": logoId},
  });
  if (!logo) {
    return next(new Error("CoverPic Not Found", {cause: 404}));
  }

  const deletedLogo = await dbService.UpdateOne({
    model: companyModel,
    filter: {_id: req.user._id},
    data: {$pull: {coverPic: {_id: logoId}}},
  });
  if (deletedLogo.modifiedCount == 0) {
    return next(new Error("Failed To Delete", {cause: 400}));
  }
  return successResponse({res});
});
export const bannCompany = asyncHandler(async (req, res, next) => {
  const {companyId} = req.params;

  const company = await dbService.find({
    model: companyModel,
    filter: {_id: companyId},
  });
  if (!company) {
    return next(new Error("User Not Found", {cause: 404}));
  }

  if (req.user.role !== roleTypes.admin) {
    return next(new Error("You are Not Authorized", {cause: 403}));
  }
  const bannedCompany = await dbService.UpdateOne({
    model: companyModel,
    filter: {
      _id: companyId,
      deletedAt: {
        $exists: false,
      },
      bannedAt: {$exists: false},
    },

    data: {bannedAt: Date.now()},
  });
  if (bannedCompany.modifiedCount == 0) {
    return next(new Error("Failed To update:You Are Not Admin", {cause: 400}));
  }
  return successResponse({res, data: {bannedCompany}});
});

export const approvedCompany = asyncHandler(async (req, res, next) => {
  const {companyId} = req.params;

  const company = await dbService.find({
    model: companyModel,
    filter: {_id: companyId},
  });
  if (!company) {
    return next(new Error("User Not Found", {cause: 404}));
  }

  if (req.user.role !== roleTypes.admin) {
    return next(new Error("You are Not Authorized", {cause: 403}));
  }
  const approveCompany = await dbService.UpdateOne({
    model: companyModel,
    filter: {
      _id: companyId,
      deletedAt: {
        $exists: false,
      },
      bannedAt: {$exists: false},
    },

    data: {approvedByAdmin: true},
  });
  if (approveCompany.modifiedCount == 0) {
    return next(new Error("Failed To update:You Are Not Admin", {cause: 400}));
  }
  return successResponse({res, data: {approveCompany}});
});
