import { disableTrade } from "~/utils/game";
import { disableBankTrade } from "~/utils/special/bank";
import type { Company } from "~/utils/sites/companies";
import type { Line } from "~/utils/sites/lines";
import type { Property } from "~/utils/sites/property";

export interface Player {
  color: Color;
  cards: {
    properties: InGameProperty[];
    companies: Company[];
    lines: Line[];
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

export function addOutOfJailCard(game: Game) {
  if (game.currentPlayerColor === undefined) {
    console.error("no player selected");
    return;
  }

  const currentPlayer = getPlayer(game, game.currentPlayerColor);
  if (!currentPlayer) {
    console.error("player search error");
    return;
  }

  currentPlayer.hasEscapePrisonCard = true;
  console.log(`${currentPlayer.color} got prisonEscapeCard`);
}

export function getInGamePropertyById(
  player: Player,
  id: number,
): InGameProperty | undefined {
  return player.cards.properties.find(
    (property) => property.property.id === id,
  );
}

export function hasPlayerCard(player: Player, id: number): boolean {
  return (
    player.cards.properties.some((property) => property.property.id === id) ||
    player.cards.lines.some((line) => line.id === id) ||
    player.cards.companies.some((company) => company.id === id)
  );
}

export function hasPlayerPropertyCard(player: Player, id: number): boolean {
  return player.cards.properties.some(
    (property) => property.property.id === id,
  );
}

export function hasPlayerLineCard(player: Player, id: number): boolean {
  return player.cards.lines.some((line) => line.id === id);
}

export function hasPlayerCompanyCard(player: Player, id: number): boolean {
  return player.cards.companies.some((company) => company.id === id);
}

export function removePropertyCardFromPlayer(player: Player, id: number) {
  const index = player.cards.properties.findIndex((p) => p.property.id === id);
  if (index !== -1) player.cards.properties.splice(index, 1);
}

export function removeLineCardFromPlayer(player: Player, id: number) {
  const index = player.cards.lines.findIndex((l) => l.id === id);
  if (index !== -1) player.cards.lines.splice(index, 1);
}

export function removeCompanyCardFromPlayer(player: Player, id: number) {
  const index = player.cards.companies.findIndex((c) => c.id === id);
  if (index !== -1) player.cards.companies.splice(index, 1);
}
