import type { CardType } from "~/utils/sites/all";
import { sellCardToBank } from "~/utils/special/bank";

export interface Property {
  id: number;
  type: CardType;
  color: string;
  state: string;
  street: string;
  rent: number;
  rent1House: number;
  rent2Houses: number;
  rent3Houses: number;
  rent4Houses: number;
  rent1Hotel: number;
  purchasePrice: number;
  housePrice: number;
  hotelPrice: number;
}

export const properties: Property[] = [
  {
    id: 39,
    color: "dark_blue",
    state: "Bregenz",
    street: "Arlbergstraße",
    rent: 8,
    rent1House: 40,
    rent2Houses: 100,
    rent3Houses: 300,
    rent4Houses: 450,
    rent1Hotel: 600,
    purchasePrice: 120,
    housePrice: 50,
    hotelPrice: 50,
    type: "property",
  },
  {
    id: 40,
    color: "dark_blue",
    state: "Bregenz",
    street: "Rathausstraße",
    rent: 14,
    rent1House: 70,
    rent2Houses: 210,
    rent3Houses: 500,
    rent4Houses: 700,
    rent1Hotel: 850,
    purchasePrice: 180,
    housePrice: 100,
    hotelPrice: 100,
    type: "property",
  },
  {
    id: 2,
    color: "dark_blue",
    state: "Bregenz",
    street: "Amtsplatz",
    rent: 20,
    rent1House: 100,
    rent2Houses: 300,
    rent3Houses: 600,
    rent4Houses: 750,
    rent1Hotel: 950,
    purchasePrice: 220,
    housePrice: 160,
    hotelPrice: 160,
    type: "property",
  },
  {
    id: 5,
    color: "dark_yellow",
    state: "Graz",
    street: "Murplatz",
    rent: 30,
    rent1House: 150,
    rent2Houses: 450,
    rent3Houses: 850,
    rent4Houses: 1050,
    rent1Hotel: 1200,
    purchasePrice: 300,
    housePrice: 200,
    hotelPrice: 200,
    type: "property",
  },
  {
    id: 6,
    color: "dark_yellow",
    state: "Graz",
    street: "Annenstraße",
    rent: 24,
    rent1House: 110,
    rent2Houses: 330,
    rent3Houses: 700,
    rent4Houses: 900,
    rent1Hotel: 1050,
    purchasePrice: 250,
    housePrice: 150,
    hotelPrice: 140,
    type: "property",
  },
  {
    id: 7,
    color: "dark_yellow",
    state: "Graz",
    street: "Joaneumring",
    rent: 20,
    rent1House: 100,
    rent2Houses: 300,
    rent3Houses: 600,
    rent4Houses: 750,
    rent1Hotel: 950,
    purchasePrice: 220,
    housePrice: 130,
    hotelPrice: 130,
    type: "property",
  },
  {
    id: 12,
    color: "pink",
    state: "Eisenstadt",
    street: "Schlossgrund",
    rent: 20,
    rent1House: 100,
    rent2Houses: 300,
    rent3Houses: 600,
    rent4Houses: 750,
    rent1Hotel: 950,
    purchasePrice: 220,
    housePrice: 160,
    hotelPrice: 160,
    type: "property",
  },
  {
    id: 10,
    color: "pink",
    state: "Eisenstadt",
    street: "Joseph-Haydn-Gasse",
    rent: 6,
    rent1House: 30,
    rent2Houses: 90,
    rent3Houses: 260,
    rent4Houses: 380,
    rent1Hotel: 550,
    purchasePrice: 100,
    housePrice: 50,
    hotelPrice: 50,
    type: "property",
  },
  {
    id: 22,
    color: "dark_green",
    state: "Linz",
    street: "Museumsstraße",
    rent: 20,
    rent1House: 100,
    rent2Houses: 300,
    rent3Houses: 600,
    rent4Houses: 750,
    rent1Hotel: 950,
    purchasePrice: 220,
    housePrice: 160,
    hotelPrice: 160,
    type: "property",
  },
  {
    id: 20,
    color: "dark_green",
    state: "Linz",
    street: "Stifterstraße",
    rent: 14,
    rent1House: 70,
    rent2Houses: 210,
    rent3Houses: 500,
    rent4Houses: 700,
    rent1Hotel: 850,
    purchasePrice: 180,
    housePrice: 100,
    hotelPrice: 100,
    type: "property",
  },
  {
    id: 19,
    color: "dark_green",
    state: "Linz",
    street: "Landstaße",
    rent: 30,
    rent1House: 150,
    rent2Houses: 450,
    rent3Houses: 850,
    rent4Houses: 1050,
    rent1Hotel: 1200,
    purchasePrice: 300,
    housePrice: 200,
    hotelPrice: 200,
    type: "property",
  },
  {
    id: 15,
    color: "red",
    state: "Wien",
    street: "Kärntnerstraße",
    rent: 50,
    rent1House: 200,
    rent2Houses: 600,
    rent3Houses: 1300,
    rent4Houses: 1600,
    rent1Hotel: 1950,
    purchasePrice: 380,
    housePrice: 220,
    hotelPrice: 220,
    type: "property",
  },
  {
    id: 17,
    color: "red",
    state: "Wien",
    street: "Kobenzlstraße",
    rent: 24,
    rent1House: 110,
    rent2Houses: 330,
    rent3Houses: 700,
    rent4Houses: 900,
    rent1Hotel: 1050,
    purchasePrice: 250,
    housePrice: 150,
    hotelPrice: 140,
    type: "property",
  },
  {
    id: 16,
    color: "red",
    state: "Wien",
    street: "Mariahilfer Straße",
    rent: 40,
    rent1House: 170,
    rent2Houses: 500,
    rent3Houses: 1000,
    rent4Houses: 1300,
    rent1Hotel: 1600,
    purchasePrice: 350,
    housePrice: 220,
    hotelPrice: 220,
    type: "property",
  },
  {
    id: 26,
    color: "light_yellow",
    state: "Salzburg",
    street: "Westbahnstraße",
    rent: 22,
    rent1House: 100,
    rent2Houses: 320,
    rent3Houses: 680,
    rent4Houses: 850,
    rent1Hotel: 1000,
    purchasePrice: 240,
    housePrice: 140,
    hotelPrice: 130,
    type: "property",
  },
  {
    id: 27,
    color: "light_yellow",
    state: "Salzburg",
    street: "Universitätsplatz",
    rent: 24,
    rent1House: 110,
    rent2Houses: 330,
    rent3Houses: 700,
    rent4Houses: 900,
    rent1Hotel: 1050,
    purchasePrice: 250,
    housePrice: 150,
    hotelPrice: 140,
    type: "property",
  },
  {
    id: 25,
    color: "light_yellow",
    state: "Salzburg",
    street: "Mirabellplatz",
    rent: 24,
    rent1House: 110,
    rent2Houses: 330,
    rent3Houses: 700,
    rent4Houses: 900,
    rent1Hotel: 1050,
    purchasePrice: 250,
    housePrice: 150,
    hotelPrice: 140,
    type: "property",
  },
  {
    id: 30,
    color: "orange",
    state: "Klagenfurt",
    street: "Villacherstraße",
    rent: 16,
    rent1House: 80,
    rent2Houses: 230,
    rent3Houses: 550,
    rent4Houses: 710,
    rent1Hotel: 900,
    purchasePrice: 200,
    housePrice: 110,
    hotelPrice: 110,
    type: "property",
  },
  {
    id: 32,
    color: "orange",
    state: "Klagenfurt",
    street: "Alter Platz",
    rent: 18,
    rent1House: 90,
    rent2Houses: 250,
    rent3Houses: 600,
    rent4Houses: 730,
    rent1Hotel: 930,
    purchasePrice: 210,
    housePrice: 120,
    hotelPrice: 150,
    type: "property",
  },
  {
    id: 29,
    color: "orange",
    state: "Klagenfurt",
    street: "Burggasse",
    rent: 10,
    rent1House: 50,
    rent2Houses: 150,
    rent3Houses: 450,
    rent4Houses: 600,
    rent1Hotel: 730,
    purchasePrice: 140,
    housePrice: 100,
    hotelPrice: 100,
    type: "property",
  },
  {
    id: 36,
    color: "light_blue",
    state: "Innsbruck",
    street: "Andreas-Hofer-Straße",
    rent: 24,
    rent1House: 110,
    rent2Houses: 330,
    rent3Houses: 700,
    rent4Houses: 900,
    rent1Hotel: 1050,
    purchasePrice: 250,
    housePrice: 150,
    hotelPrice: 140,
    type: "property",
  },
  {
    id: 35,
    color: "light_blue",
    state: "Innsbruck",
    street: "Maria-Theresien-Straße",
    rent: 30,
    rent1House: 150,
    rent2Houses: 450,
    rent3Houses: 850,
    rent4Houses: 1050,
    rent1Hotel: 1200,
    purchasePrice: 300,
    housePrice: 200,
    hotelPrice: 200,
    type: "property",
  },
  {
    id: 37,
    color: "light_blue",
    state: "Innsbruck",
    street: "Boznerplatz",
    rent: 30,
    rent1House: 150,
    rent2Houses: 450,
    rent3Houses: 850,
    rent4Houses: 1050,
    rent1Hotel: 1200,
    purchasePrice: 300,
    housePrice: 300,
    hotelPrice: 200,
    type: "property",
  },
];

export function getPropertyById(id: number): Property | undefined {
  return properties.find((property: Property) => property.id === id);
}

export function removePropertyCardFromGamePool(game: Game, id: number) {
  const index = game.cards.properties.findIndex((p) => p.id === id);
  if (index !== -1) game.cards.properties.splice(index, 1);
}

export function getAllPropertiesByPlayer(player: Player) {
  return player.cards.properties;
}

export function activatePropertyCard(game: Game, id: number) {
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

  if (game.bankTrade.active) {
    sellCardToBank({ id: id, type: "property" }, currentPlayer, game);
    return;
  }

  if (game.trade.active) {
    game.trade.tradeCardIds.push({ id: id, type: "property" });

    console.log(`${id} was added to trade list`);

    return;
  }

  //property is owned by other player
  if (!isCardAvailable(game, id) && !isCardOwnedByCurrentPlayer(game, id)) {
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
