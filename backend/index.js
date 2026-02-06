import express from "express";
import cors from "cors";
import { createServer } from "http";
import Helmet from "helmet";
import jwt from "./core/jwt/index.js";
import connenction from "./core/connection/index.js";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(Helmet());

const id = Number(process.argv[2]) || 0;
const PORT = 3000 + id;

const server = createServer(app);

app.get('/api', (req, res) => res.json({
  online: true
}));

app.use('/api/v1', jwt);

import USER from "./app/users/index.js";
import ROOM from "./app/room/index.js";
import LOGIN from "./app/users/auth/index.js";

app.use('/api/login', LOGIN);
jwt.use('/users', USER);
jwt.use('/room', ROOM);

app.use((err, req, res, next) => {
  console.error("Erro capturado:", err.message, req.url, req.body);
  return res.json({ success: false, err: "Ocorreu um erro interno", form: req.body });
});

server.listen(PORT, "0.0.0.0");
console.log("Server start at: " + PORT);
