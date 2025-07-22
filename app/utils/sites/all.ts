import { sellCardToBank } from "~/utils/special/bank";
import {
  getPropertyById,
  removePropertyCardFromGamePool,
} from "~/utils/sites/property";

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
    sellCardToBank(id, currentPlayer);
    return;
  }

  if (game.trade.active) {
    game.trade.tradeCardIds.push(id);

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
