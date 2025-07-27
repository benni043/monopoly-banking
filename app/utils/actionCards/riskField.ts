import { activatePropertyLevy } from "~/utils/special/propertyLevy";

export interface RiskField {
  id: number;
  text: string;
  amount: number;
}

export const riskCards: RiskField[] = [
  {
    id: 1,
    text: "Für unerlaubtes Parken bezahlst du",
    amount: -10,
  },
  {
    id: 2,
    text: "Für eine Autoreparatur bezahlst du",
    amount: -140,
  },
  {
    id: 3,
    text: `Für die Auswertun einer Erfindung erhältst du ${0} aus öffentlichen Mitteln`,
    amount: 140,
  },
  {
    id: 4,
    text: "Für Unfallversicherung bezahlst du",
    amount: -200,
  },
  {
    id: 5,
    text: "Die BankField zahlt dir an Dividenden",
    amount: 60,
  },
  {
    id: 6,
    text: `Zahle ${0} Polizeistrafe`,
    amount: -5,
  },
  {
    id: 7,
    text: "Diese Karte befreit dich aus dem Arrest! Hebe diese Karte auf du wirst sie brauchen.",
    amount: 0,
  },
  {
    id: 8,
    text: "Gehe in den Arrest",
    amount: 0,
  },
  {
    id: 9,
    text: "Gehe um 4 Felder zurück.",
    amount: 0,
  },
  {
    id: 10,
    text: "Reise mit dem Flugzeug Wien-Venedig. Passierst du den Start erhältst du 200",
    amount: 0,
  },
  {
    id: 11,
    text: "Besuche Salzburg und gehe am Mirabellplatz spazieren. Passierst du den Start, erhältst du 200",
    amount: 0,
  },
  {
    id: 12,
    text: "Besuche Graz und gehe auf der Annenstraße spazieren. Passierst du den Start, erhältst du 200",
    amount: 0,
  },
  {
    id: 13,
    text: "Gehe auf Feld 22. Passierst du den Start, erhältst du 200",
    amount: 0,
  },
  {
    id: 14,
    text: "An Grundsteuer zahlst du für deine Grundstücke 10% vom Kaufwert",
    amount: 0,
  },
  {
    id: 15,
    text: "Für jedes Haus in deinem Besitz bezahlst du an Reparaturkosten 20,- für jedes Hotel 80,-",
    amount: 0,
  },
];

export function getRiskCardById(id: number): RiskField | undefined {
  return riskCards.find((risk: RiskField) => risk.id === id);
}

export function activateRiskCard(game: Game, id: number) {
  if (game.currentPlayerColor === undefined) {
    console.error("no player selected");
    return;
  }

  const currentPlayer = getPlayer(game, game.currentPlayerColor);
  if (!currentPlayer) {
    console.error("player search error");
    return;
  }

  const riskCardById = getRiskCardById(id);
  if (!riskCardById) {
    console.error("risk card error");
    return;
  }

  switch (id) {
    case 14: {
      activatePropertyLevy(game);
      console.log("property levy after risk card");
      console.log(currentPlayer.money);
      break;
    }
    case 15: {
      payHouseAndHotelPriceSum(currentPlayer);
      console.log(currentPlayer.money);
      console.log("payd for all houses");
      break;
    }
    default: {
      currentPlayer.money += riskCardById.amount;
      console.log(riskCardById.amount);
      console.log(riskCardById.text);
    }
  }
}

export function payHouseAndHotelPriceSum(player: Player) {
  let houses = 0;
  let hotels = 0;

  player.cards.properties.forEach((property: InGameProperty) => {
    houses += property.houseCount;
    hotels += property.hotelCount;
  });

  player.money -= houses * 20 + hotels * 80;
}
