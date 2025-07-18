import { companies, lines, properties, getPropertyById } from "./cards";
import type { Color, Player, InGameProperty } from "./types";

export interface Game {
  players: Player[];
  availableHouses: number;
  availableHotels: number;

  started: boolean;
  currentPlayerColor: Color | undefined;

  trade: { active: boolean; tradePlayer: Player | undefined };
  cards: {
    properties: Property[];
    companies: Extra[];
    lines: Extra[];
  };
}

export function createGame(): Game {
  return {
    started: false,
    currentPlayerColor: undefined,
    players: [],
    availableHouses: 32,
    availableHotels: 8,
    trade: {
      active: false,
      tradePlayer: undefined,
    },
    cards: {
      lines: [...lines],
      companies: [...companies],
      properties: [...properties],
    },
  };
}

export function activatePlayerCard(game: Game, color: Color) {
  if (!game.started) {
    if (checkIfPlayerAlreadyInGame(game, color)) {
      console.error("player already inGame");
      return;
    }

    const player: Player = {
      cards: {
        lines: [],
        companies: [],
        properties: [],
      },
      color: color,
      hasEscapePrisonCard: false,
      money: 1500,
    };

    game.players.push(player);

    console.log(`added player: ${color} successfully!`);

    //todo wait a few seconds after each player and then start
    if (game.players.length >= 2) game.started = true;
    return;
  }

  if (game.currentPlayerColor === undefined) {
    game.currentPlayerColor = color;

    console.log(`${color} is now the active player`);
  } else if (game.currentPlayerColor === color) {
    game.currentPlayerColor = undefined;

    console.log(`${color} is no longer the active player`);
  } else {
    game.trade.active = true;
    game.trade.tradePlayer = getPlayer(game, color)!;

    console.log(game.trade.tradePlayer);

    console.log("trade own card with another player");
  }
}

export function activatePropertyCard(game: Game, id: number) {
  if (!game.started) {
    console.error("game not started");
    return;
  }

  if (game.currentPlayerColor === undefined) {
    console.error("no player selected");
    return;
  }

  const property = getPropertyById(id);
  if (!property) {
    console.error("illegal id");
    return;
  }

  const currentPlayer = getPlayer(game, game.currentPlayerColor);
  if (!currentPlayer) {
    console.error("player search error");
    return;
  }

  //property is owned by other player
  if (!isCardAvailable(game, id) && !isCardOwnedByCurrentPlayer(game, id)) {
    if (game.trade.active) {
      tradeProperty(game, true, currentPlayer, id);
      return;
    }

    const opponent = getPlayerByCard(game, id);
    if (!opponent) {
      console.error("opponent does not have this card");
      return;
    }

    const inGameProperty = getInGamePropertyById(opponent, id)!;

    if (inGameProperty.hotelCount === 1) {
      opponent.money += property.rent1Hotel;
      currentPlayer.money -= property.rent1Hotel;
    } else {
      const rentMap = [
        property.rent,
        property.rent1House,
        property.rent2Houses,
        property.rent3Houses,
        property.rent4Houses,
      ];

      const houseCount = inGameProperty.houseCount;
      const rent = rentMap[houseCount] || property.rent;

      opponent.money += rent;
      currentPlayer.money -= rent;
    }

    console.log(`opponent: ${opponent.money}`);
    console.log(`me: ${currentPlayer.money}`);
    return;
  }

  const hasProperty = hasPlayerPropertyCard(currentPlayer, id);

  //property is free
  if (!hasProperty) {
    if (game.trade.active) {
      console.log(
        "this property does not belong to anyone yet, you cant trade this",
      );

      disableTrade(game);
      return;
    }

    if (currentPlayer.money < property.purchasePrice) {
      console.log("you don't have enough money to buy this property");
      return;
    }

    currentPlayer.cards.properties.push({
      property: property,
      houseCount: 0,
      hotelCount: 0,
    });

    currentPlayer.money -= property.purchasePrice;
    removePropertyCardFromGamePool(game, id);

    console.log(`you have bought ${property.street}`);
    console.log(`me: ${currentPlayer.money}`);

    return;
  }

  //player owns property
  if (game.trade.active) {
    tradeProperty(game, false, currentPlayer, id);
    return;
  }

  const inGameProperty = getInGamePropertyById(currentPlayer, id)!;

  if (inGameProperty.hotelCount === 1) {
    console.log(
      `you have reached the maximum house/hotel capacity for ${property.street}`,
    );
  } else if (
    inGameProperty.houseCount + 1 <= 4 &&
    currentPlayer.money >= property.housePrice
  ) {
    inGameProperty.houseCount++;
    currentPlayer.money -= property.housePrice;
    game.availableHouses--;

    console.log(`you have successfully built a house on ${property.street}`);
    console.log(`me: ${currentPlayer.money}`);
  } else if (
    inGameProperty.houseCount === 4 &&
    currentPlayer.money >= property.hotelPrice
  ) {
    inGameProperty.houseCount = 0;
    inGameProperty.hotelCount = 1;

    game.availableHotels--;
    game.availableHouses += 4;

    currentPlayer.money -= property.hotelPrice;

    console.log(`you have successfully built a hotel on ${property.street}`);
    console.log(`me: ${currentPlayer.money}`);
  } else {
    console.log(
      `you don't have enough money to buy a house on ${property.street}`,
    );
  }
}

export function outOfJail(game: Game) {
  if (!game.started) {
    console.error("game not started");
    return;
  }

  if (game.currentPlayerColor === undefined) {
    console.error("no player selected");
    return;
  }

  const currentPlayer = getPlayer(game, game.currentPlayerColor);
  if (!currentPlayer) {
    console.error("player search error");
    return;
  }

  if (currentPlayer.hasEscapePrisonCard)
    currentPlayer.hasEscapePrisonCard = false;
  else currentPlayer.money -= 50;
}

export function getPlayer(game: Game, color: Color): Player | undefined {
  return game.players.find((p) => p.color === color);
}

export function getActivePlayer(game: Game): Player | undefined {
  return game.currentPlayerColor
    ? getPlayer(game, game.currentPlayerColor)
    : undefined;
}

//internal helpers
function disableTrade(game: Game) {
  game.trade.active = false;
  game.trade.tradePlayer = undefined;

  console.log("trade end");
}

function tradeProperty(
  game: Game,
  addProperty: boolean,
  currentPlayer: Player,
  id: number,
) {
  const input = prompt("Enter the amount: ");
  const amount = Number(input);

  if (addProperty) {
    if (currentPlayer.money < amount) {
      console.log(
        `${currentPlayer.color} has not enough money to buy this property`,
      );

      disableTrade(game);
      return;
    }

    currentPlayer.money -= amount;
    game.trade.tradePlayer!.money += amount;

    const inGameProperty = getInGamePropertyById(game.trade.tradePlayer!, id)!;

    currentPlayer.cards.properties.push(structuredClone(inGameProperty));
    removePropertyCardFromPlayer(game.trade.tradePlayer!, id);
  } else {
    if (game.trade.tradePlayer!.money < amount) {
      console.log(
        `${game.trade.tradePlayer!.color} has not enough money to buy this property`,
      );

      disableTrade(game);
      return;
    }

    currentPlayer.money += amount;
    game.trade.tradePlayer!.money -= amount;

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

function addEscapePrisonCard(player: Player) {
  player.hasEscapePrisonCard = true;
}

function getPlayerByCard(game: Game, id: number): Player | undefined {
  return game.players.find((player) =>
    player.cards.properties.some((property) => property.property.id === id),
  );
}

function getInGamePropertyById(
  player: Player,
  id: number,
): InGameProperty | undefined {
  return player.cards.properties.find(
    (property) => property.property.id === id,
  );
}

function hasPlayerPropertyCard(player: Player, id: number): boolean {
  return player.cards.properties.some(
    (property) => property.property.id === id,
  );
}

function isCardAvailable(game: Game, id: number): boolean {
  return (
    game.cards.properties.some((p) => p.id === id) ||
    game.cards.lines.some((c) => c.id === id) ||
    game.cards.companies.some((c) => c.id === id)
  );
}

function isCardOwnedByCurrentPlayer(game: Game, id: number): boolean {
  if (!game.started || game.currentPlayerColor === undefined) return false;
  const player = getPlayer(game, game.currentPlayerColor);
  if (!player) return false;

  return player.cards.properties.some((p) => p.property.id === id);
}

function checkIfPlayerAlreadyInGame(game: Game, color: Color): boolean {
  return game.players.some((p) => p.color === color);
}

function removePropertyCardFromGamePool(game: Game, id: number) {
  const index = game.cards.properties.findIndex((p) => p.id === id);
  if (index !== -1) game.cards.properties.splice(index, 1);
}

function removePropertyCardFromPlayer(player: Player, id: number) {
  const index = player.cards.properties.findIndex((p) => p.property.id === id);
  if (index !== -1) player.cards.properties.splice(index, 1);
}
