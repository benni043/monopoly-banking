import { io } from "socket.io-client";
import { finishedOneRound, payAndTrade } from "~/utils/game";
import { activateBankCard } from "~/utils/bank";

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

    socket.on("game:pay", (amount: number) => {
      payAndTrade(gameRef!.value, amount);
    });

    socket.on("game:bankTrade", () => {
      activateBankCard(gameRef!.value);
    });
  }

  return { game: gameRef };
}
