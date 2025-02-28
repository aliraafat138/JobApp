import Joi from "joi";
import {generalFields} from "../../MiddleWare/validation.js";

export const CreateCompany = Joi.object()
  .keys({
    companyName: generalFields.companyName,
    description: generalFields.description,
    industry: generalFields.industry,
    address: generalFields.address,
    numberOfEmployees: generalFields.numberOfEmployees,
    companyEmail: generalFields.email,
  })
  .required();
