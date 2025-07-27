import type { CardType } from "~/utils/sites/all";

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
