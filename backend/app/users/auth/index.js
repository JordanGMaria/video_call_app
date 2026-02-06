import express from "express";
import controller from "./controller.js";

const routes = express.Router();

routes.post("/", controller.login);

export default routes;
