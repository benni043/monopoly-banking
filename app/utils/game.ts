export interface Game {
  players: Player[];
  availableHouses: number;
  availableHotels: number;

  currentPlayerColor: Color | undefined;

  trade: {
    active: boolean;
    tradePlayer: Player | undefined;
    tradeAmount: number | undefined;
  };
  cards: {
    properties: Property[];
    companies: Extra[];
    lines: Extra[];
  };
}

export function createGame(): Game {
  return {
    currentPlayerColor: undefined,
    players: [],
    availableHouses: 32,
    availableHotels: 8,
    trade: {
      active: false,
      tradePlayer: undefined,
      tradeAmount: undefined,
    },
    cards: {
      lines: [...lines],
      companies: [...companies],
      properties: [...properties],
    },
  };
}

export function setTradeAmount(game: Game, amount: number) {
  game.trade.tradeAmount = amount;
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

  console.log("trade end");
}

function isRunningInNode(): boolean {
  return (
    typeof process !== "undefined" &&
    process.versions != null &&
    process.versions.node != null
  );
}

export function tradeProperty(
  game: Game,
  addProperty: boolean,
  currentPlayer: Player,
  id: number,
) {
  if (!isRunningInNode()) {
    const input = prompt("Enter the amount: ");
    const amount = Number(input);

    setTradeAmount(game, amount);
  }

  if (addProperty) {
    if (currentPlayer.money < game.trade.tradeAmount!) {
      console.log(
        `${currentPlayer.color} has not enough money to buy this property`,
      );

      disableTrade(game);
      return;
    }

    currentPlayer.money -= game.trade.tradeAmount!;
    game.trade.tradePlayer!.money += game.trade.tradeAmount!;

    const inGameProperty = getInGamePropertyById(game.trade.tradePlayer!, id)!;

    currentPlayer.cards.properties.push(inGameProperty);
    removePropertyCardFromPlayer(game.trade.tradePlayer!, id);
  } else {
    if (game.trade.tradePlayer!.money < game.trade.tradeAmount!) {
      console.log(
        `${game.trade.tradePlayer!.color} has not enough money to buy this property`,
      );

      disableTrade(game);
      return;
    }

    currentPlayer.money += game.trade.tradeAmount!;
    game.trade.tradePlayer!.money -= game.trade.tradeAmount!;

    const inGameProperty = getInGamePropertyById(currentPlayer, id)!;

    game.trade.tradePlayer!.cards.properties.push(inGameProperty);
    removePropertyCardFromPlayer(currentPlayer, id);
  }

  console.log(`opponent: ${game.trade.tradePlayer!.money}`);
  console.log(`me: ${currentPlayer.money}`);

  console.log("opponent: ");
  game.trade.tradePlayer!.cards.properties.forEach((p) => console.log(p));

  console.log("me: ");
  currentPlayer.cards.properties.forEach((p) => console.log(p));

  disableTrade(game);
  console.log("trade was successfully");

  return;
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
