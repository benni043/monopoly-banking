import { io } from "socket.io-client";
import { finishedOneRound } from "~/utils/game";

let gameRef: Ref<Game> | undefined;
let socket: ReturnType<typeof io> | undefined;

export function useGame() {
  if (!gameRef) {
    gameRef = ref(createGame());
  }

  if (!socket) {
    socket = io("/", {
      path: "/api/socket.io",
    });

    socket.on("game:playerCard", (color: Color) => {
      activatePlayerCard(gameRef!.value, color);
    });

    socket.on("game:propertyCard", (id: number) => {
      activatePropertyCard(gameRef!.value, id);
    });

    socket.on("game:jailCard", () => {
      outOfJail(gameRef!.value);
    });

    socket.on("game:finishedOneRound", () => {
      finishedOneRound(gameRef!.value);
    });
  }

  return { game: gameRef };
}
