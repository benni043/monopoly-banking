import { Server, type ServerOptions, type Socket } from "socket.io";
import { handleGameEvents } from "~~/server/socket-io/handler/handler";
import type { H3Event } from "h3";

const options: Partial<ServerOptions> = {
    path: "/api/socket.io",
    serveClient: false,
};

export const io = new Server(options);

let isInitialized = false;

export function initSocket(event: H3Event) {
    if (isInitialized) return;
    isInitialized = true;

    // @ts-ignore
    const server = event.node.res?.socket?.server;
    if (!server) {
        console.warn("HTTP Server nicht gefunden für Socket.IO");
        return;
    }

    io.attach(server);

    io.of("/").on("connection", (socket: Socket) => {
        console.log(`${socket.id} connected to /`)
        handleGameEvents(socket, io.of("/"));
    });
}
