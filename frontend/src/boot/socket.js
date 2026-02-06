import { boot } from "quasar/wrappers";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

let socket;

export default boot(({ app }) => {
  socket = io(SOCKET_URL, {
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on("connect", () => {
    console.log("[INFO] Socket.IO conectado:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("[ERROR] Socket.IO desconectado:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("[ERROR] Erro de conexão Socket.IO:", error);
  });

  app.config.globalProperties.$socket = socket;
  app.provide("socket", socket);
});

export { socket };
