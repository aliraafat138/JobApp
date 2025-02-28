import jwt from "jsonwebtoken";
import * as dbService from "../../DB/db.service.js";
import {userModel} from "../../DB/Models/User.Model.js";
export const tokenTypes = {access: "access", refresh: "refresh"};
export const decodedToken = async ({
  authorization = "",
  tokenType = tokenTypes.access,
  next = {},
} = {}) => {
  const [bearer, token] = authorization ? authorization.split(" ") : [];
  if (!bearer || !token) {
    return next(new Error("Invalid Token Parts", {cause: 400}));
  }
  let access_signature = "";
  let refresh_signature = "";
  switch (bearer) {
    case "System":
      access_signature = process.env.ADMIN_ACCESS_SIGNATURE;
      refresh_signature = process.env.ADMIN_REFRESH_SIGNATURE;
      break;
    case "Bearer":
      access_signature = process.env.USER_ACCESS_SIGNATURE;
      refresh_signature = process.env.USER_REFRESH_SIGNATURE;
      break;
    default:
      break;
  }
  const decoded = verifyToken({
    token,
    signature:
      tokenType === tokenTypes.access ? access_signature : refresh_signature,
  });
  if (!decoded || !decoded.id) {
    return next(new Error("Invalid Token", {cause: 401}));
  }
  const user = await dbService.findOne({
    model: userModel,
    filter: {_id: decoded.id, deletedAt: {$exists: false}},
  });
  if (!user) {
    return next(new Error("User not found", {cause: 404}));
  }
  if (
    user.changeCredentialTime &&
    user.changeCredentialTime.getTime() > decoded.iat * 1000
  ) {
    return next(new Error("Invalid Login Credential", {cause: 400}));
  }

  return user;
};
export const generateToken = ({payload = {}, signature} = {}) => {
  const token = jwt.sign(payload, signature);
  return token;
};

export const verifyToken = ({token, signature}) => {
  const decode = jwt.verify(token, signature);
  return decode;
};
