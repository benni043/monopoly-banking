export interface Risiko {
  id: number;
  text: string;
  amount: number;
}

export const risikoCards: Risiko[] = [
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
    text: "Die Bank zahlt dir an Dividenden",
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
