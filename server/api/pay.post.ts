import type { H3Event } from "h3";
import { initSocket, io } from "~~/server/socket-io";

export default defineEventHandler(async (event: H3Event) => {
  initSocket(event);

  const body = await readBody(event);

  const { amount } = body;

  io.of("/").emit("game:pay", amount);

  return {
    statusCode: 200,
  };
});
