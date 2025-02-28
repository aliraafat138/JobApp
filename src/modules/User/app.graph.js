import {GraphQLObjectType, GraphQLSchema} from "graphql";
import * as companyController from "../Company/comp.graph.conrtoller.js";
export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "query",
    fields: {
      ...companyController.query,
    },
  }),
});
