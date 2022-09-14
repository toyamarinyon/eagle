import { WebSocket } from "ws";

let sockets: WebSocket[] = [];
export function startWebSocketServer() {
  const server = new WebSocket.Server({
    port: 30111,
  });
  server.on("connection", (socket) => {
    sockets.push(socket);
    socket.on("close", () => {
      sockets = sockets.filter((s) => s !== socket);
    });
  });
  return server;
}

export function sendMessageToBrowser() {
  sockets.forEach((socket) => {
    socket.send("signal");
  });
}
