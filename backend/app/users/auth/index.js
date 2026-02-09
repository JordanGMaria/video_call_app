import express from "express";
import { login} from "./controller.js";

const routes = express.Router();

routes.post("/", login);

export default routes;
