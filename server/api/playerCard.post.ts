import type { H3Event } from "h3";
import { initSocket, io } from "~~/server/socket-io";

export default defineEventHandler(async (event: H3Event) => {
  initSocket(event);

  const body = await readBody(event);

  const { color } = body;

  io.of("/").emit("game:playerCard", color);

  return {
    statusCode: 200,
  };
});
