import { io } from "socket.io-client";
import { activateBankTradeCard } from "~/utils/special/bank";
import { activatePropertyLevy } from "~/utils/special/propertyLevy";
import { activateBankCard } from "~/utils/actionCards/bankField";
import { activateRiskCard } from "~/utils/actionCards/riskField";
import { activatePropertyCard } from "~/utils/sites/property";
import { activateLineCard } from "~/utils/sites/lines";

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

    socket.on("game:lineCard", (id: number) => {
      activateLineCard(gameRef!.value, id);
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
      activateBankTradeCard(gameRef!.value);
    });

    socket.on("game:propertyLevy", () => {
      activatePropertyLevy(gameRef!.value);
    });

    socket.on("game:bankCard", (id: number) => {
      activateBankCard(gameRef!.value, id);
    });

    socket.on("game:risikoCard", (id: number) => {
      activateRiskCard(gameRef!.value, id);
    });
  }

  return { game: gameRef };
}
