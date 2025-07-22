import { hasPlayerPropertyCard } from "~/utils/player";
import { properties, type Property } from "~/utils/sites/property";
import { companies, type Company } from "~/utils/sites/companies";
import { type Line, lines } from "~/utils/sites/lines";

export interface Game {
  players: Player[];
  availableHouses: number;
  availableHotels: number;

  currentPlayerColor: Color | undefined;

  bankTrade: {
    active: boolean;
  };

  trade: {
    active: boolean;
    tradePlayer: Player | undefined;
    tradeAmount: number | undefined;
    tradeCardIds: number[];
  };

  cards: {
    properties: Property[];
    companies: Company[];
    lines: Line[];
  };
}

export function createGame(): Game {
  return {
    currentPlayerColor: undefined,
    players: [],
    availableHouses: 32,
    availableHotels: 8,
    bankTrade: {
      active: false,
    },
    trade: {
      active: false,
      tradePlayer: undefined,
      tradeAmount: undefined,
      tradeCardIds: [],
    },
    cards: {
      lines: [...lines],
      companies: [...companies],
      properties: [...properties],
    },
  };
}

export function outOfJail(game: Game) {
  if (game.currentPlayerColor === undefined) {
    console.error("no player selected");
    return;
  }

  const currentPlayer = getPlayer(game, game.currentPlayerColor);
  if (!currentPlayer) {
    console.error("player search error");
    return;
  }

  if (currentPlayer.hasEscapePrisonCard) {
    currentPlayer.hasEscapePrisonCard = false;
    console.log(`${game.currentPlayerColor} has used his prison escape card`);
  } else {
    currentPlayer.money -= 50;
    console.log(`${game.currentPlayerColor} has payed 50$ for prison`);
  }
}

export function finishedOneRound(game: Game) {
  if (game.currentPlayerColor === undefined) {
    console.error("no player selected");
    return;
  }

  const currentPlayer = getPlayer(game, game.currentPlayerColor);
  if (!currentPlayer) {
    console.error("player search error");
    return;
  }

  currentPlayer.money += 200;
  console.log(`${game.currentPlayerColor} got 200$`);
}

export function disableTrade(game: Game) {
  game.trade.active = false;
  game.trade.tradePlayer = undefined;
  game.trade.tradeAmount = undefined;
  game.trade.tradeCardIds = [];

  console.log("trade end");
}

export function payAndTrade(game: Game, amount: number) {
  game.trade.tradeAmount = amount;

  const currentPlayer = getPlayer(game, game.currentPlayerColor!);
  if (!currentPlayer) {
    console.error("player search error");
    return;
  }

  let firstResult = null;

  for (let tradeCardId of game.trade.tradeCardIds) {
    const result = hasPlayerPropertyCard(currentPlayer, tradeCardId);

    if (firstResult === null) {
      firstResult = result;
    } else if (result !== firstResult) {
      console.log(
        `only cards from ${game.currentPlayerColor} or ${game.trade.tradePlayer!.color} are allowed`,
      );
      return;
    }
  }

  let success = payProperty(game, !firstResult!, currentPlayer);
  if (!success) {
    disableTrade(game);
    return;
  }

  tradeProperty(game, !firstResult!, currentPlayer, game.trade.tradeCardIds);

  disableTrade(game);
  console.log("trade was successfully");
}

export function payProperty(
  game: Game,
  addProperty: boolean,
  currentPlayer: Player,
): boolean {
  if (addProperty) {
    if (currentPlayer.money < game.trade.tradeAmount!) {
      console.log(
        `${currentPlayer.color} has not enough money to buy this property`,
      );

      disableTrade(game);
      return false;
    }

    currentPlayer.money -= game.trade.tradeAmount!;
    game.trade.tradePlayer!.money += game.trade.tradeAmount!;
  } else {
    if (game.trade.tradePlayer!.money < game.trade.tradeAmount!) {
      console.log(
        `${game.trade.tradePlayer!.color} has not enough money to buy this property`,
      );

      disableTrade(game);
      return false;
    }

    currentPlayer.money += game.trade.tradeAmount!;
    game.trade.tradePlayer!.money -= game.trade.tradeAmount!;
  }

  console.log(`opponent: ${game.trade.tradePlayer!.money}`);
  console.log(`me: ${currentPlayer.money}`);

  return true;
}

export function tradeProperty(
  game: Game,
  addProperty: boolean,
  currentPlayer: Player,
  ids: number[],
) {
  for (let id of ids) {
    if (addProperty) {
      const inGameProperty = getInGamePropertyById(
        game.trade.tradePlayer!,
        id,
      )!;

      currentPlayer.cards.properties.push(inGameProperty);
      removePropertyCardFromPlayer(game.trade.tradePlayer!, id);
    } else {
      const inGameProperty = getInGamePropertyById(currentPlayer, id)!;

      game.trade.tradePlayer!.cards.properties.push(inGameProperty);
      removePropertyCardFromPlayer(currentPlayer, id);
    }
  }

  console.log("opponent: ");
  game.trade.tradePlayer!.cards.properties.forEach((p) => console.log(p));

  console.log("me: ");
  currentPlayer.cards.properties.forEach((p) => console.log(p));
}

export function getPlayerByCard(game: Game, id: number): Player | undefined {
  return game.players.find((player) =>
    player.cards.properties.some((property) => property.property.id === id),
  );
}

export function isCardAvailable(game: Game, id: number): boolean {
  return (
    game.cards.properties.some((p) => p.id === id) ||
    game.cards.lines.some((c) => c.id === id) ||
    game.cards.companies.some((c) => c.id === id)
  );
}

export function isCardOwnedByCurrentPlayer(game: Game, id: number): boolean {
  if (game.currentPlayerColor === undefined) return false;
  const player = getPlayer(game, game.currentPlayerColor);
  if (!player) return false;

  return player.cards.properties.some((p) => p.property.id === id);
}

export function checkIfPlayerAlreadyInGame(game: Game, color: Color): boolean {
  return game.players.some((p) => p.color === color);
}
