import * as companyQueryServices from "../Company/service/comp.query.service.js";
import * as companyTypes from "./Types/comp.types.service.js";

export const query = {
  companyList: {
    type: companyTypes.companyListRes,
    resolve: companyQueryServices.CompanyList,
  },
};
