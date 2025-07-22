import { io } from "socket.io-client";
import { activatePropertyCard } from "~/utils/sites/all";
import { activateBankCard } from "~/utils/special/bank";
import { activatePropertyLevy } from "~/utils/special/propertyLevy";

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

    socket.on("game:oufOfJail", () => {
      outOfJail(gameRef!.value);
    });

    socket.on("game:getJailCard", () => {
      addOutOfJailCard(gameRef!.value);
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

    socket.on("game:propertyLevy", () => {
      activatePropertyLevy(gameRef!.value);
    });
  }

  return { game: gameRef };
}
