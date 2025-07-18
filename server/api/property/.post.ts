import type { H3Event } from "h3";
import { initSocket, io } from "~~/server/socket-io";

export default defineEventHandler(async (event: H3Event) => {
  initSocket(event);

  const body = await readBody(event);

  const { id } = body;

  io.of("/").emit("game:propertyCard", id);

  return {
    statusCode: 200,
  };
});
