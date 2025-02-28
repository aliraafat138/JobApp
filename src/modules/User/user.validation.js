import Joi from "joi";
import {generalFields} from "../../MiddleWare/validation.js";

export const UpdatePassword = Joi.object()
  .keys({
    oldPassword: generalFields.password.not(Joi.ref("password")).required(),
    Password: generalFields.password.required(),
    confirmPassword: generalFields.confirmPassword
      .valid(Joi.ref("Password"))
      .required(),
  })
  .required();

export const UpdateProfile = Joi.object()
  .keys({
    firstName: generalFields.firstName.required(),
    lastName: generalFields.lastName.required(),
    phone: generalFields.phone.required(),
    gender: generalFields.gender.required(),
  })
  .required();

export const ProfileImage = Joi.object()
  .keys({
    file: generalFields.file.required(),
  })
  .required();
export const CoverImage = Joi.object()
  .keys({
    file: generalFields.file.required(),
  })
  .required();
