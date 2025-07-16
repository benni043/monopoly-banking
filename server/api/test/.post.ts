import type { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
    const body = await readBody(event);

    const {data} = body;

    console.log(data)

    return {
        statusCode: 200,
    };
});