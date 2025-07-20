export function activateBankCard(game: Game) {
  if (game.currentPlayerColor === undefined) {
    console.log("no player selected");
    return;
  }

  if (!game.bankTrade.active) {
    console.log("bank trade activated");
    game.bankTrade.active = true;
  } else {
    console.log("bank trade disabled");
    disableBankTrade(game);
  }
}

export function disableBankTrade(game: Game) {
  game.bankTrade.active = false;
}

export function sellCardToBank(id: number, currentPlayer: Player) {
  if (!hasPlayerPropertyCard(currentPlayer, id)) {
    console.log("this property does not belong to you");
    return;
  }

  let inGamePropertyById = getInGamePropertyById(currentPlayer, id)!;

  if (inGamePropertyById.hotelCount === 1) {
    currentPlayer.money += inGamePropertyById.property.hotelPrice / 2;
    inGamePropertyById.hotelCount = 0;
    inGamePropertyById.houseCount = 4;

    console.log(
      `${currentPlayer.color} sold 1 hotel to bank for ${inGamePropertyById.property.hotelPrice / 2}`,
    );

    return;
  }

  if (inGamePropertyById.houseCount >= 1) {
    currentPlayer.money += inGamePropertyById.property.housePrice / 2;
    inGamePropertyById.houseCount -= 1;

    console.log(
      `${currentPlayer.color} sold 1 house to bank for ${inGamePropertyById.property.housePrice / 2}`,
    );

    return;
  }

  currentPlayer.money += inGamePropertyById.property.purchasePrice / 2;
  removePropertyCardFromPlayer(currentPlayer, id);

  console.log(
    `${currentPlayer.color} sold ${inGamePropertyById.property.street} to bank for ${inGamePropertyById.property.purchasePrice / 2}`,
  );
}
