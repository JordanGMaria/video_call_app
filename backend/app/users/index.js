import express from "express";
import controller from "./controller.js";

const routes = express.Router();

routes.post("/list", controller.index);
routes.post("/", controller.new);

export default routes;
