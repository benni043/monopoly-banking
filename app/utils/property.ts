export interface Property {
  id: number;
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

export interface Extra {
  id: number;
  type: string;
  name: string;
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

  //property is owned by other player
  if (!isCardAvailable(game, id) && !isCardOwnedByCurrentPlayer(game, id)) {
    if (game.trade.active) {
      tradeProperty(game, true, currentPlayer, id);
      return;
    }

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
    if (game.trade.active) {
      console.log(
        "this property does not belong to anyone yet, you cant trade this",
      );

      disableTrade(game);
      return;
    }

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

  //player owns property
  if (game.trade.active) {
    tradeProperty(game, false, currentPlayer, id);
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

export function removePropertyCardFromGamePool(game: Game, id: number) {
  const index = game.cards.properties.findIndex((p) => p.id === id);
  if (index !== -1) game.cards.properties.splice(index, 1);
}
