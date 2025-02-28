import {
  GraphQLEnumType,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import {attachResponse} from "../../../Utilis/sharedTypes.js";
export const userResponse = new GraphQLObjectType({
  name: "UserResponse",
  fields: {
    _id: {type: GraphQLID},
    firstName: {type: GraphQLString},
    lastName: {type: GraphQLString},
    email: {type: GraphQLString},
    profilePic: {type: attachResponse},
    coverPic: {type: attachResponse},
    gender: {
      type: new GraphQLEnumType({
        name: "GenderTypes",
        values: {
          male: {type: GraphQLString},
          female: {type: GraphQLString},
        },
      }),
    },
    role: {
      type: new GraphQLEnumType({
        name: "RoleTypes",
        values: {
          user: {type: GraphQLString},
          Admin: {type: GraphQLString},
        },
      }),
    },
    updatedBy: {type: GraphQLID},
  },
});
