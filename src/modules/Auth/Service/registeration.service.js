import {asyncHandler} from "../../../Utilis/error/error.js";
import * as dbService from "../../../DB/db.service.js";
import {userModel} from "../../../DB/Models/User.Model.js";
import {emailEvent} from "../../../Utilis/email/Events/email.event.js";
import {successResponse} from "../../../Utilis/successResponse/response.js";
import {compareHash} from "../../../Utilis/security/hash.js";

export const signup = asyncHandler(async (req, res, next) => {
  const {firstName, lastName, email, password, DOB, mobileNumber} = req.body;
  if (await dbService.findOne({model: userModel, filter: {email}})) {
    return next(new Error("Email Exist", {cause: 409}));
  }
  const user = await userModel.create({
    firstName,
    lastName,
    email,
    password,
    DOB,
    mobileNumber,
  });
  emailEvent.emit("SendConfirmEmail", {email});
  return successResponse({
    res,
    data: {user},
    status: 201,
    message: "User Created Successfully",
  });
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const {email, code} = req.body;
  const user = await dbService.findOne({model: userModel, filter: {email}});
  if (!user) {
    return next(new Error("User Not Found", {cause: 404}));
  }
  if (user.isConfirmed) {
    return next(new Error("already confirmed", {cause: 409}));
  }
  const validOtp = user.OTP.find((otp) => otp.expiresIn > Date.now());
  if (!validOtp) {
    return next(new Error("OTP Expired", {cause: 400}));
  }
  if (!compareHash({plainText: code, hashValue: validOtp.code})) {
    return next(new Error("Invalid  Code", {cause: 400}));
  }
  await dbService.UpdateOne({
    model: userModel,
    filter: {email},
    data: {isConfirmed: true, $unset: {OTP: 0}},
  });
  return successResponse({res, data: {user}});
});
