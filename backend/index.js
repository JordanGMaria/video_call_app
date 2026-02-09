


import express from "express";
import cors from "cors";
import { createServer } from "http";
import Helmet from "helmet";
import jwt from "./core/jwt/index.js";
import "./core/connection/index.js";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(Helmet());

const id = Number(process.argv[2]) || 0;
const PORT = parseInt(process.env.PORT || 3000) + id;

const server = createServer(app);

// PUBLIC ROUTES 
app.get('/api', (req, res) => res.json({ online: true }));
app.use("/api/login", (await import("./app/users/auth/index.js")).default);

// PRIVATE ROUTES 
app.use('/api/v1', jwt);
jwt.use('/users', (await import("./app/users/index.js")).default); 
jwt.use('/room', (await import("./app/room/index.js")).default);

app.use((err, req, res, next) => {
  console.error("Erro capturado:", err.message, req.url, req.body);
  return res.json({ success: false, err: "Ocorreu um erro interno", form: req.body });
});

server.listen(PORT, "0.0.0.0");
console.log("Server start at: " + PORT);
