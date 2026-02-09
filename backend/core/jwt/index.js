import express from "express";
import jwt from "jsonwebtoken";
import "../env/index.js";

const SECRET = process.env.JWT_SECRET || "SECRET_KEY";

const AuthRouter = express.Router();

AuthRouter.use((req, res, next) => {
  const rawHeader = req.headers?.authorization;
  const headerToken = rawHeader?.startsWith("Bearer ") ? rawHeader.slice(7) : rawHeader;
  const token = req.body?.token || req.query?.token || headerToken;

  if (token) {
    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        return res.json({ success: false, message: "User authentication failed!", login: true });
      }
      req.decoded = decoded;
      return next();
    });
    return;
  }

  return res.status(403).send({ success: false, message: "User authentication failed!" });
});

export default AuthRouter;
