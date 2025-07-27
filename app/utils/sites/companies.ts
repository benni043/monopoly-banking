import type { CardType } from "~/utils/sites/all";

export interface Company {
  id: number;
  type: CardType;
  name: string;
}

export const companies: Company[] = [
  {
    id: 34,
    type: "company",
    name: "Flugl. Wien-Venedig",
  },
  {
    id: 14,
    type: "company",
    name: "Seilbahn",
  },
  {
    id: 4,
    type: "company",
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

export function getAllCompaniesByPlayer(player: Player) {
  return player.cards.companies;
}
