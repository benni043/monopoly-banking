import { disableTrade } from "~/utils/game";
import { disableBankTrade } from "~/utils/bank";

export interface Player {
  color: Color;
  cards: {
    properties: InGameProperty[];
    companies: Extra[];
    lines: Extra[];
  };
  money: number;
  hasEscapePrisonCard: boolean;
}

export interface InGameProperty {
  property: Property;
  houseCount: number;
  hotelCount: number;
}

export type Color = "green" | "yellow" | "red" | "blue";

export function getPlayer(game: Game, color: Color): Player | undefined {
  return game.players.find((p) => p.color === color);
}

export function getActivePlayer(game: Game): Player | undefined {
  return game.currentPlayerColor
    ? getPlayer(game, game.currentPlayerColor)
    : undefined;
}

export function activatePlayerCard(game: Game, color: Color) {
  if (!checkIfPlayerAlreadyInGame(game, color)) {
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

    return;
  }

  if (game.currentPlayerColor === undefined) {
    game.currentPlayerColor = color;

    console.log(`${color} is now the active player`);
  } else if (game.currentPlayerColor === color) {
    game.currentPlayerColor = undefined;

    disableTrade(game);
    disableBankTrade(game);

    console.log(`${color} is no longer the active player`);
  } else {
    game.trade.active = true;
    game.trade.tradePlayer = getPlayer(game, color)!;

    console.log("trade own card with another player");
  }
}

export function addEscapePrisonCard(player: Player) {
  player.hasEscapePrisonCard = true;
}

export function getInGamePropertyById(
  player: Player,
  id: number,
): InGameProperty | undefined {
  return player.cards.properties.find(
    (property) => property.property.id === id,
  );
}

export function hasPlayerPropertyCard(player: Player, id: number): boolean {
  return player.cards.properties.some(
    (property) => property.property.id === id,
  );
}

export function removePropertyCardFromPlayer(player: Player, id: number) {
  const index = player.cards.properties.findIndex((p) => p.property.id === id);
  if (index !== -1) player.cards.properties.splice(index, 1);
}
