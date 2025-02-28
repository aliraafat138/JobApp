import {connectDB} from "./DB/dbConnection.js";
import {globalErrorHandling} from "./Utilis/error/error.js";
import authController from "./modules/Auth/auth.controller.js";
import userController from "./modules/User/user.controller.js";
import companyController from "./modules/Company/company.controller.js";
import jobController from "./modules/Job/job.controller.js";
import applicationController from "./modules/Applications/application.controller.js";
import {createHandler} from "graphql-http/lib/use/express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import {schema} from "./modules/User/app.graph.js";
import helmet from "helmet";
const limiter = rateLimit({
  limit: 2,
  windowMs: 2 * 60 * 1000,
  message: {err: "Rate Limit Reached"},
  statusCode: 429,
  legacyHeaders: true,
  standardHeaders: "draft-8",
});
const bootstrap = (app, express) => {
    app.use(express.json());
  app.use(cors());
  app.use(helmet());
  app.use("/auth", limiter);
  app.use("/graphql", createHandler({schema: schema}));
  app.get("/", (req, res) => res.send("Hello World!"));
  app.use("/auth", authController);
  app.use("/user", userController);
  app.use("/company", companyController);
  app.use("/job", jobController);
  app.use("/application", applicationController);
  app.all("*", (res) => {
    return res.status(404).json({message: "invalid routing"});
  });
  app.use(globalErrorHandling);
  connectDB();
};
export default bootstrap;
