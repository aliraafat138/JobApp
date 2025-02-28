import {Router} from "express";
import {confirmEmail, signup} from "./Service/registeration.service.js";
import * as validators from "./auth.validation.js";
import {
  forgetPassword,
  login,
  loginWithGmail,
  refreshToken,
  resetPassword,
} from "./Service/login.service.js";
import {validation} from "../../MiddleWare/validation.js";
const router = Router();
router.post("/Signup", validation(validators.Signup), signup);
router.post("/loginWithGmail", loginWithGmail);
router.patch(
  "/ConfirmEmail",
  validation(validators.ConfirmEmail),
  confirmEmail
);
router.post("/Login", validation(validators.Login), login);
router.get("/Refresh-token", refreshToken);
router.patch(
  "/ForgetPass",
  validation(validators.ForgetPassword),
  forgetPassword
);
router.patch("/ResetPass", validation(validators.ResetPassword), resetPassword);
export default router;
