import express from "express";
import { WebSocketServer } from "ws";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

const server = app.listen(PORT, () => {
  console.log(`[log info] API rodando em http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ server });
const rooms = new Map();

wss.on("connection", (ws) => {
  console.log("[log info] Nova conexão WebSocket");
  ws.on("message", (message) => {
    const data = JSON.parse(message);
    console.log(`[log info] Mensagem recebida: ${data.type}`);

    switch (data.type) {
      case "join":
        ws.roomId = data.roomId;

        if (!rooms.has(data.roomId)) {
          rooms.set(data.roomId, []);
          console.log(`[log info] Sala criada: ${data.roomId}`);
        }

        rooms.get(data.roomId).push(ws);
        console.log(`[log info] Cliente entrou na sala: ${data.roomId} (total: ${rooms.get(data.roomId).length})`);
        break;

      case "offer":
      case "answer":
      case "candidate":
        console.log(`[log info] Encaminhando ${data.type} para sala ${ws.roomId}`);
        rooms.get(ws.roomId)?.forEach((client) => {
          if (client !== ws && client.readyState === 1) {
            client.send(JSON.stringify(data));
          }
        });
        break;
    }
  });

  ws.on("close", () => {
    const room = rooms.get(ws.roomId);
    if (room) {
      rooms.set(
        ws.roomId,
        room.filter((client) => client !== ws)
      );
      console.log(`[log info] Cliente saiu da sala: ${ws.roomId} (total: ${rooms.get(ws.roomId).length})`);
      if (rooms.get(ws.roomId).length === 0) {
        rooms.delete(ws.roomId);
        console.log(`[log info] Sala removida: ${ws.roomId}`);
      }
    }
  });
});
