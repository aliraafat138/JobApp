import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import {attachResponse} from "../../../Utilis/sharedTypes.js";
import {userResponse} from "../../User/Types/user.types.js";

export const oneCompanyResponse = new GraphQLObjectType({
  name: "OneCompanyRes",
  fields: {
    _id: {type: GraphQLID},
    companyName: {type: GraphQLString},
    description: {type: GraphQLString},
    industry: {type: GraphQLString},
    numberOfEmployees: {type: GraphQLString},
    address: {type: GraphQLString},
    companyEmail: {type: GraphQLString},
    Logo: {type: new GraphQLList(attachResponse)},
    coverPic: {type: new GraphQLList(attachResponse)},
    createdBy: {type: userResponse},
    deletedAt: {type: GraphQLString},
  },
});

export const companyListRes = new GraphQLObjectType({
  name: "companyResponse",
  fields: {
    message: {type: GraphQLString},
    statusCode: {type: GraphQLInt},
    data: {type: new GraphQLList(oneCompanyResponse)},
  },
});
