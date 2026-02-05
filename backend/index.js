import express from "express";
import cors from "cors";
import { createServer } from "http";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const id = Number(process.argv[2]) || 0;
const PORT = 3000 + id;

const server = createServer(app);

app.use((err, req, res, next) => {
  console.error('Erro capturado:', err.message, req.url, req.body);
  return res.json({ success: false, err: "Ocorreu um erro interno", form: req.body });
});

server.listen(PORT, '0.0.0.0');
console.log('Server start at: ' + PORT);