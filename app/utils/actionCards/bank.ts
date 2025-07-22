import type { Property } from "~/utils/sites/property";

export interface Bank {
  id: number;
  text: string;
  amount: number;
}

export const bankCards: Bank[] = [
  {
    id: 41,
    text: "Für Bankzinsen erhältst du",
    amount: 180,
  },
  {
    id: 42,
    text: "Für eine gewonnene Wette erhältst du",
    amount: 120,
  },
  {
    id: 43,
    text: "Wegen Übertretung der Fahrordnung bezahle",
    amount: -15,
  },
  {
    id: 44,
    text: "Kauf dir ein Los der Klassenlotterie und bezahle",
    amount: -48,
  },
  {
    id: 45,
    text: "Für den Verkauf von Wertpapieren erhältst du",
    amount: 50,
  },
  {
    id: 46,
    text: "An die Krankenkasse bezahle",
    amount: -130,
  },
  {
    id: 47,
    text: "Die Bank bezahlt dir an Zinsen",
    amount: 25,
  },
  {
    id: 48,
    text: "Für Gehsteigreinigung bezahle",
    amount: -40,
  },
  {
    id: 49,
    text: "Gehe zum Start und behebe",
    amount: 200,
  },
  {
    id: 50,
    text: "An Versicherungskosten für deine Häuser bezahlst du",
    amount: -50,
  },
  {
    id: 51,
    text: `Eine Geschäftsanbahnung bringt dir ${0} an Provision`,
    amount: 35,
  },
  {
    id: 52,
    text: `Für eine Geschäftsvermittlung erhältst du ${0} Provision`,
    amount: 20,
  },
  {
    id: 53,
    text: `In Der Klassenlotterie hast du ${0} gewonnen`,
    amount: 20,
  },
  {
    id: 54,
    text: "Bezahle deine Lebensversicherungsprämie",
    amount: -120,
  },
  {
    id: 55,
    text: "Gehe in den Arrest!",
    amount: 0,
  },
];

export function getBankCardById(id: number): Bank | undefined {
  return bankCards.find((bank: Bank) => bank.id === id);
}

export function activateBankCard(game: Game, id: number) {
  if (game.currentPlayerColor === undefined) {
    console.error("no player selected");
    return;
  }

  const currentPlayer = getPlayer(game, game.currentPlayerColor);
  if (!currentPlayer) {
    console.error("player search error");
    return;
  }

  const bankCardById = getBankCardById(id);
  if (!bankCardById) {
    console.error("bank card error");
    return;
  }

  currentPlayer.money += bankCardById.amount;

  console.log(bankCardById.amount);
  console.log(bankCardById.text);
}