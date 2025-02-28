import {EventEmitter} from "events";
import {customAlphabet} from "nanoid";
import {generateHash} from "../../security/hash.js";

import {sendEmail} from "../send.email.js";
import {confirmEmailTemplate} from "../Template/confirmTemplate.js";
import {userModel} from "../../../DB/Models/User.Model.js";
export const emailEvent = new EventEmitter();
export const subjectTypes = {
  confirmEmail: "confirm-email",
  resetPassword: "reset-password",
  accept: "accept",
  reject: "reject",
};
export const sendCode = async ({
  data = {},
  subject = subjectTypes.confirmEmail,
} = {}) => {
  const {id, email} = data;
  const OTP = customAlphabet("0123456789", 4)();
  const hashOTP = generateHash({plainText: OTP});
  const html = confirmEmailTemplate({code: OTP});
  let updateData = {};
  const expiresIn = new Date(Date.now() + 10 * 60 * 1000);
  switch (subject) {
    case subjectTypes.confirmEmail:
      updateData = {
        $push: {
          OTP: {code: hashOTP, type: subjectTypes.confirmEmail, expiresIn},
        },
      };
      break;
    case subjectTypes.resetPassword:
      updateData = {
        $push: {
          OTP: {code: hashOTP, type: subjectTypes.confirmEmail, expiresIn},
        },
      };
      break;
    case subjectTypes.accept:
      updateData = {
        $push: {
          OTP: {code: hashOTP, type: subjectTypes.accept, expiresIn},
        },
      };
      break;
    case subjectTypes.reject:
      updateData = {
        $push: {
          OTP: {code: hashOTP, type: subjectTypes.reject, expiresIn},
        },
      };
      break;
    default:
      break;
  }
  await userModel.updateOne({email}, updateData);

  await sendEmail({to: email, subject, html});
};
emailEvent.on("SendConfirmEmail", async (data) => {
  await sendCode({data});
});

emailEvent.on("ForgetPassword", async (data) => {
  await sendCode({data, subject: subjectTypes.resetPassword});
});

emailEvent.on("Accept", async (data) => {
  await sendCode({data, subject: subjectTypes.accept});
});
emailEvent.on("Reject", async (data) => {
  await sendCode({data, subject: subjectTypes.reject});
});
