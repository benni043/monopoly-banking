import type { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
    console.log("gettet")

    return {
        statusCode: 200,
    };
});