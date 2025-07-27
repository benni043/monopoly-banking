import type { CardType } from "~/utils/sites/all";
import { sellCardToBank } from "~/utils/special/bank";
import { hasPlayerLineCard } from "~/utils/player";
import { getPlayerByCard } from "~/utils/game";

export interface Line {
  id: number;
  type: CardType;
  name: string;
}

export const lines: Line[] = [
  {
    id: 18,
    type: "line",
    name: "Wien-Innsbruck",
  },
  {
    id: 8,
    type: "line",
    name: "Wien-Graz",
  },
  {
    id: 24,
    type: "line",
    name: "Glocknerstraße",
  },
  {
    id: 13,
    type: "line",
    name: "Wien-Budapest",
  },
];

export function getLineById(id: number): Line | undefined {
  return lines.find((line: Line) => line.id === id);
}

export function removeLineCardFromGamePool(game: Game, id: number) {
  const index = game.cards.lines.findIndex((p) => p.id === id);
  if (index !== -1) game.cards.lines.splice(index, 1);
}

export function getAllLinesByPlayer(player: Player) {
  return player.cards.lines;
}

export function activateLineCard(game: Game, id: number) {
  if (game.currentPlayerColor === undefined) {
    console.error("no player selected");
    return;
  }

  const lineById = getLineById(id);
  if (!lineById) {
    console.error("illegal id");
    return;
  }

  const currentPlayer = getPlayer(game, game.currentPlayerColor);
  if (!currentPlayer) {
    console.error("player search error");
    return;
  }

  if (game.bankTrade.active) {
    sellCardToBank({ id: id, type: "line" }, currentPlayer, game);
    return;
  }

  if (game.trade.active) {
    game.trade.tradeCardIds.push({ id: id, type: "line" });

    console.log(`${id} was added to trade list`);

    return;
  }

  //line is owned by other player
  if (!isCardAvailable(game, id) && !isCardOwnedByCurrentPlayer(game, id)) {
    const opponent = getPlayerByCard(game, id);
    if (!opponent) {
      console.error("opponent does not have this card");
      return;
    }

    const lineCount = getAllLinesByPlayer(getPlayerByCard(game, id)!).length;

    switch (lineCount) {
      case 1: {
        opponent.money += 20;
        currentPlayer.money -= 20;
        break;
      }
      case 2: {
        opponent.money += 40;
        currentPlayer.money -= 40;
        break;
      }
      case 3: {
        opponent.money += 80;
        currentPlayer.money -= 80;
        break;
      }
      default: {
        opponent.money += 160;
        currentPlayer.money -= 160;
        break;
      }
    }

    console.log(`opponent: ${opponent.money}`);
    console.log(`me: ${currentPlayer.money}`);
    return;
  }

  const hasLine = hasPlayerLineCard(currentPlayer, id);

  //line is free
  if (!hasLine) {
    if (currentPlayer.money < 160) {
      console.log("you don't have enough money to buy this property");
      return;
    }

    currentPlayer.cards.lines.push(lineById);

    currentPlayer.money -= 160;
    removeLineCardFromGamePool(game, id);

    console.log(`you have bought ${lineById.name}`);
    console.log(`me: ${currentPlayer.money}`);

    return;
  }

  console.log(`you already have ${lineById.name}`);
}
