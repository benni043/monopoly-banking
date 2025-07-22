import { getAllPropertiesByPlayer } from "~/utils/sites/property";

export function activatePropertyLevy(game: Game) {
  if (game.currentPlayerColor === undefined) {
    console.error("no player selected");
    return;
  }

  const currentPlayer = getPlayer(game, game.currentPlayerColor);
  if (!currentPlayer) {
    console.error("player search error");
    return;
  }

  const allPropertiesByPlayer = getAllPropertiesByPlayer(currentPlayer);

  let sum = 0;

  allPropertiesByPlayer.forEach((property) => {
    sum += property.property.purchasePrice;
  });

  currentPlayer.money -= Math.floor(sum / 10);
  console.log(`${currentPlayer.color} has payed ${sum / 10} propertylevy`);
}
