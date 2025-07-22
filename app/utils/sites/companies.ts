export interface Company {
  id: number;
  type: string;
  name: string;
}

export const companies: Company[] = [
  {
    id: 34,
    type: "Betrieb",
    name: "Flugl. Wien-Venedig",
  },
  {
    id: 14,
    type: "Betrieb",
    name: "Seilbahn",
  },
  {
    id: 4,
    type: "Betrieb",
    name: "Elektr. Kraftwerk",
  },
];

export function getCompanyById(id: number): Company | undefined {
  return companies.find((company: Company) => company.id === id);
}

export function removeCompanyCardFromGamePool(game: Game, id: number) {
  const index = game.cards.companies.findIndex((p) => p.id === id);
  if (index !== -1) game.cards.companies.splice(index, 1);
}

export function getAllCompaniesByPlayer(game: Game, player: Player) {
  return player.cards.companies;
}
