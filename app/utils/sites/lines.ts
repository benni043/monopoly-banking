export interface Line {
  id: number;
  type: string;
  name: string;
}

export const lines: Line[] = [
  {
    id: 18,
    type: "Linie",
    name: "Wien-Innsbruck",
  },
  {
    id: 8,
    type: "Linie",
    name: "Wien-Graz",
  },
  {
    id: 24,
    type: "Linie",
    name: "Glocknerstraße",
  },
  {
    id: 13,
    type: "Linie",
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
