import {asyncHandler} from "../../../Utilis/error/error.js";
import * as dbService from "../../../DB/db.service.js";
import {roleTypes, userModel} from "../../../DB/Models/User.Model.js";
import {generateEncryption} from "../../../Utilis/security/encryption.js";
import {successResponse} from "../../../Utilis/successResponse/response.js";
import {compareHash, generateHash} from "../../../Utilis/security/hash.js";
import {cloud} from "../../../Utilis/multer/cloudinary.js";

export const updateProfile = asyncHandler(async (req, res, ne) => {
  const {mobileNumber, firstName, lastName, gender} = req.body;
  const encryptPhone = generateEncryption({plainText: mobileNumber});
  const user = await dbService.findOneAndUpdate({
    model: userModel,
    filter: {_id: req.user._id, deletedAt: {$exists: false}},
    data: {mobileNumber: encryptPhone, firstName, lastName, gender},
    options: {new: true},
  });
  return successResponse({res, data: {user}});
});

export const profile = asyncHandler(async (req, res, next) => {
  const user = await dbService.findOne({
    model: userModel,
    filter: {_id: req.user._id},
    select: "firstName lastName mobileNumber profilePic coverPic",
  });
  return successResponse({res, data: {user}});
});

export const updatePassword = asyncHandler(async (req, res, next) => {
  const {oldPassword, Password} = req.body;
  if (!compareHash({plainText: oldPassword, hashValue: req.user.password})) {
    return next(new Error("Invalid Old Password", {cause: 400}));
  }

  await dbService.UpdateOne({
    model: userModel,
    filter: {_id: req.user._id},
    data: {
      password: generateHash({plainText: Password}),
      changeCredentialTime: Date.now(),
    },
  });
  return successResponse({res});
});

export const uploadProfilePic = asyncHandler(async (req, res, next) => {
  let profilePic = [];
  for (const file of req.files) {
    const {secure_url, public_id} = await cloud.uploader.upload(file.path, {
      folder: `${process.env.APP_NAME}/pic/${req.user._id}/profile`,
    });
    profilePic.push({secure_url, public_id});
  }

  const pic = await dbService.UpdateOne({
    model: userModel,
    filter: {_id: req.user._id, deletedAt: {$exists: false}},
    data: {
      $push: {profilePic: {$each: profilePic}},
    },
  });
  return successResponse({res, status: 201, data: {pic}});
});

export const uploadCoverPic = asyncHandler(async (req, res, next) => {
  let coverPic = [];
  for (const file of req.files) {
    const {secure_url, public_id} = await cloud.uploader.upload(file.path, {
      folder: `${process.env.APP_NAME}/cover/${req.user._id}/profile`,
    });
    coverPic.push({secure_url, public_id});
  }

  const pic = await dbService.UpdateOne({
    model: userModel,
    filter: {_id: req.user._id},
    data: {
      $push: {coverPic: {$each: coverPic}},
    },
  });
  return successResponse({res, status: 201, data: {pic}});
});

export const deletePic = asyncHandler(async (req, res, next) => {
  const {picId} = req.params;

  const pic = await dbService.findOne({
    model: userModel,
    filter: {_id: req.user._id, "profilePic._id": picId},
  });
  if (!pic) {
    return next(new Error("Pic Not Found", {cause: 404}));
  }
  const deletedPic = await userModel.updateOne(
    {_id: req.user._id},
    {$pull: {profilePic: {_id: picId}}}
  );

  return successResponse({res});
});
export const deleteCover = asyncHandler(async (req, res, next) => {
  const {coverId} = req.params;

  const cover = await dbService.findOne({
    model: userModel,
    filter: {_id: req.user._id, "coverPic._id": coverId},
  });
  console.log(cover.coverPic);

  if (!cover) {
    return next(new Error("Cover Not Found", {cause: 404}));
  }
  const deletedCover = await userModel.updateOne(
    {_id: req.user._id},
    {$pull: {coverPic: {_id: coverId}}}
  );

  return successResponse({res});
});

export const softDelete = asyncHandler(async (req, res, next) => {
  const {userId} = req.params;
  const user = await dbService.findOne({
    model: userModel,
    filter: {_id: userId},
  });
  if (!user) {
    return next(new Error("User Not Found", {cause: 404}));
  }
  const deletedUser = await dbService.UpdateOne({
    model: userModel,
    filter: {_id: userId},
    data: {deletedAt: Date.now()},
  });
  return successResponse({res, deletedUser});
});

export const bannUser = asyncHandler(async (req, res, next) => {
  const {userId} = req.params;

  const user = await dbService.find({
    model: userModel,
    filter: {_id: userId},
  });
  if (!user) {
    return next(new Error("User Not Found", {cause: 404}));
  }

  if (req.user.role !== roleTypes.admin) {
    return next(new Error("You are Not Authorized", {cause: 403}));
  }
  const bannedUser = await dbService.UpdateOne({
    model: userModel,
    filter: {
      _id: userId,
      deletedAt: {
        $exists: false,
      },
      bannedAt: {$exists: false},
      role: roleTypes.user,
    },

    data: {bannedAt: Date.now()},
  });
  if (bannedUser.modifiedCount == 0) {
    return next(new Error("Failed To update:You Are Not Admin", {cause: 400}));
  }
  return successResponse({res, data: {bannedUser}});
});
