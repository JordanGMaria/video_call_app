import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:3000";
const ROOM_ID = "sala-teste";

const socket = io(SERVER_URL, {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("[cliente] conectado", socket.id);
  socket.emit("join", { roomId: ROOM_ID });
});

socket.on("disconnect", (reason) => {
  console.log("[cliente] desconectado:", reason);
});

socket.on("connect_error", (err) => {
  console.error("[cliente] erro de conexão:", err.message);
});

// Listeners básicos para ver tráfego entre instâncias
["offer", "answer", "candidate"].forEach((event) => {
  socket.on(event, (payload) => {
    console.log(`[cliente] recebido ${event}:`, payload);
  });
});

// Envia um sinal de teste a cada 10s para verificar broadcast entre salas/instâncias
const sendHeartbeat = () => {
  socket.emit("offer", { roomId: ROOM_ID, ts: Date.now(), from: socket.id });
  console.log("[cliente] heartbeat enviado");
};

const interval = setInterval(() => {
  if (socket.connected) sendHeartbeat();
}, 10000);

process.on("SIGINT", () => {
  clearInterval(interval);
  socket.close();
  console.log("\n[cliente] encerrado");
  process.exit(0);
});
