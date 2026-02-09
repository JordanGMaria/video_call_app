import express from "express";
import { index, insert, get, remove } from "./controller.js";

const routes = express.Router();

routes.post("/list", index);
routes.post("/", insert);
routes.get("/:id", get);
routes.delete("/:id", remove);

export default routes;
