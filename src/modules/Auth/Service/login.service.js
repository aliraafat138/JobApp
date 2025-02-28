import {asyncHandler} from "../../../Utilis/error/error.js";
import * as dbService from "../../../DB/db.service.js";
import {OAuth2Client} from "google-auth-library";
import {compareHash, generateHash} from "../../../Utilis/security/hash.js";
import {
  decodedToken,
  generateToken,
  tokenTypes,
} from "../../../Utilis/security/token.js";
import {
  providerTypes,
  roleTypes,
  userModel,
} from "../../../DB/Models/User.Model.js";
import {successResponse} from "../../../Utilis/successResponse/response.js";
import {emailEvent} from "../../../Utilis/email/Events/email.event.js";

export const login = asyncHandler(async (req, res, next) => {
  const {email, password} = req.body;
  const user = await dbService.findOne({model: userModel, filter: {email}});
  if (!user) {
    return next(new Error("User not found", {cause: 404}));
  }
  if (!user.isConfirmed) {
    return next(new Error("Please Confirm Your Email First", {cause: 404}));
  }
  if (!compareHash({plainText: password, hashValue: user.password})) {
    return next(new Error("Invalid Login", {cause: 400}));
  }
  const refreshToken = generateToken({
    payload: {id: user._id},
    signature:
      user.role === roleTypes.admin
        ? process.env.ADMIN_REFRESH_SIGNATURE
        : process.env.USER_REFRESH_SIGNATURE,
    options: {expiresIn: "7d"},
  });
  const accessToken = generateToken({
    payload: {id: user._id},
    signature:
      user.role === roleTypes.admin
        ? process.env.ADMIN_ACCESS_SIGNATURE
        : process.env.USER_ACCESS_SIGNATURE,
    options: {expiresIn: "1h"},
  });

  return successResponse({res, data: {token: {accessToken, refreshToken}}});
});
export const loginWithGmail = asyncHandler(async (req, res, next) => {
  const {idToken} = req.body;
  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  }
  const payload = await verify();

  if (!payload.email_verified) {
    return next(new Error("Invalid-Account", {cause: 400}));
  }
  let user = await userModel.findOne({email: payload.email});
  if (!user) {
    user = await userModel.create({
      userName: payload.name,
      email: payload.email,
      isConfirmed: payload.email_verified,
      image: payload.picture,
      provider: providerTypes.google,
    });
  }
  if (user.provider != providerTypes.google) {
    return next(new Error("Invalid Provider", {cause: 400}));
  }
  const refreshToken = generateToken({
    payload: {id: user._id},
    signature:
      user.role === roleTypes.admin
        ? process.env.ADMIN_REFRESH_SIGNATURE
        : process.env.USER_REFRESH_SIGNATURE,
    options: {expiresIn: "7d"},
  });
  const accessToken = generateToken({
    payload: {id: user._id},
    signature:
      user.role === roleTypes.admin
        ? process.env.ADMIN_ACCESS_SIGNATURE
        : process.env.USER_ACCESS_SIGNATURE,
    options: {expiresIn: "1h"},
  });
  return successResponse({res, data: {accessToken, refreshToken}});
});
export const refreshToken = asyncHandler(async (req, res, next) => {
  const {authorization} = req.headers;
  const user = await decodedToken({
    authorization,
    tokenType: tokenTypes.refresh,
    next,
  });
  const accessToken = generateToken({
    payload: {id: user._id},
    signature:
      user.role === roleTypes.admin
        ? process.env.ADMIN_ACCESS_SIGNATURE
        : process.env.USER_ACCESS_SIGNATURE,
    options: {expiresIn: "1h"},
  });
  const refreshToken = generateToken({
    payload: {id: user._id},
    signature:
      user.role === roleTypes.admin
        ? process.env.ADMIN_REFRESH_SIGNATURE
        : process.env.USER_REFRESH_SIGNATURE,
    options: {expiresIn: "7d"},
  });

  return successResponse({res, data: {token: {accessToken, refreshToken}}});
});

export const forgetPassword = asyncHandler(async (req, res, next) => {
  const {email} = req.body;
  const user = await dbService.findOne({model: userModel, filter: {email}});
  if (!user) {
    return next(new Error("User Not Found", {cause: 404}));
  }
  if (!user.isConfirmed) {
    return next(new Error("Please Confirm Email", {cause: 400}));
  }
  emailEvent.emit("ForgetPassword", {id: user.id, email});
  return successResponse({res});
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const {email, code, password} = req.body;
  const user = await dbService.findOne({model: userModel, filter: {email}});
  if (!user) {
    return next(new Error("User Not Found", {cause: 404}));
  }
  const validOtp = user.OTP.find((otp) => otp.expiresIn > Date.now());
  if (!validOtp) {
    return next(new Error("OTP Expired", {cause: 400}));
  }

  if (!compareHash({plainText: code, hashValue: validOtp.code})) {
    return next(new Error("Invalid Code", {cause: 400}));
  }
  await dbService.UpdateOne({
    model: userModel,
    filter: {email},
    data: {
      password: generateHash({plainText: password}),
      changeCredentialTime: Date.now(),
      $unset: {OTP: 0},
    },
  });
  return successResponse({res});
});
