import * as dbService from "../../../DB/db.service.js";
import {companyModel} from "../../../DB/Models/Company.Model.js";

export const CompanyList = async (parent, args) => {
  const company = await dbService.find({
    model: companyModel,
    populate: [
      {
        path: "createdBy",
      },
    ],
  });
  return {message: "Done", statusCode: 200, data: company};
};
