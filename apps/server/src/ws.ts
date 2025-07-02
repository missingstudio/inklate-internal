import { upgradeWebSocket } from "hono/cloudflare-workers";
import { WebSocket } from "@cloudflare/workers-types";
import { WebSocketMessage } from "./types";
import { WSContext } from "hono/ws";

export const webSocketHandler = upgradeWebSocket((c) => {
  let isConnected = false;
  return {
    onMessage(event: any, ws: WSContext<WebSocket>) {
      try {
        const data = JSON.parse(event.data);
        switch (data.event) {
          case "connect":
            isConnected = true;
            ws.send(JSON.stringify({ event: "connected" }));
            break;
          case "disconnect":
            isConnected = false;
            ws.send(JSON.stringify({ event: "disconnected" }));
            break;
          case "message":
            ws.send(JSON.stringify({ event: "message", data: data.data }));
            break;
        }
      } catch (error: any) {
        const errorResponse: WebSocketMessage = {
          type: "log",
          status: "error",
          message: error.message
        };
        ws.send(JSON.stringify(errorResponse));
      }
    },
    onClose(event: any, ws: WSContext<WebSocket>) {
      isConnected = false;
      ws.send(JSON.stringify({ type: "log", status: "info", message: "Disconnected from server" }));
    }
  };
});
