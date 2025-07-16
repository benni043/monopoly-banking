import type {H3Event} from "h3";
import {io, initSocket} from "~~/server/socket-io";

export default defineEventHandler(async (event: H3Event) => {
    initSocket(event);

    const body = await readBody(event);

    const {data} = body;

    console.log(data)

    io.of("/").emit("game:update", data);

    return {
        statusCode: 200,
    };
});