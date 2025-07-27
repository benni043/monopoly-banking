import type { CardType } from "~/utils/sites/all";
import {
  hasPlayerCard,
  removeCompanyCardFromPlayer,
  removeLineCardFromPlayer,
} from "~/utils/player";
import { getPropertyById } from "~/utils/sites/property";
import { getLineById } from "~/utils/sites/lines";
import { getCompanyById } from "~/utils/sites/companies";

export function activateBankTradeCard(game: Game) {
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

export function sellCardToBank(
  obj: { id: number; type: CardType },
  currentPlayer: Player,
  game: Game,
) {
  if (!hasPlayerCard(currentPlayer, obj.id)) {
    console.log("this property does not belong to you");
    return;
  }

  switch (obj.type) {
    case "property": {
      let inGamePropertyById = getInGamePropertyById(currentPlayer, obj.id)!;

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
      removePropertyCardFromPlayer(currentPlayer, obj.id);
      game.cards.properties.push(getPropertyById(obj.id)!);

      console.log(
        `${currentPlayer.color} sold ${inGamePropertyById.property.street} to bank for ${inGamePropertyById.property.purchasePrice / 2}`,
      );

      break;
    }
    case "line": {
      currentPlayer.money += 80;
      removeLineCardFromPlayer(currentPlayer, obj.id);
      game.cards.lines.push(getLineById(obj.id)!);

      console.log(`${currentPlayer.color} sold line to bank for 80`);

      break;
    }
    default: {
      currentPlayer.money += 80;
      removeCompanyCardFromPlayer(currentPlayer, obj.id);
      game.cards.companies.push(getCompanyById(obj.id)!);

      console.log(`${currentPlayer.color} sold company to bank for 80`);

      break;
    }
  }
}
