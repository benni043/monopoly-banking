import type { H3Event } from "h3";
import { initSocket, io } from "~~/server/socket-io";

export default defineEventHandler(async (event: H3Event) => {
  initSocket(event);

  io.of("/").emit("game:jailCard");

  return {
    statusCode: 200,
  };
});
