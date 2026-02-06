import express from "express";
import controller from "./controller.js";

const routes = express.Router();

routes.post("/list", controller.index);
routes.post("/", controller.new);
routes.get("/:id", controller.get);
routes.delete("/:id", controller.delete);

export default routes;
