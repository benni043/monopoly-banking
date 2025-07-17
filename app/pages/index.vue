<script setup lang="ts">

import {io} from "socket.io-client";
import type {Color, Game, Player} from "~/utils/types";
import {companies, lines, properties} from "~/utils/cards";

const socket = io("/", {
  path: "/api/socket.io",
});

socket.on("game:playerCard", (color: Color) => {
  if (!game.started) {
    addPlayer(color)

    if (game.players.length >= 2) game.started = true;
  } else {
    if (game.currentPlayerColor === undefined) {
      game.currentPlayerColor = color;

      console.log(`${color} is now the active player`)
    } else if (game.currentPlayerColor === color) {
      game.currentPlayerColor = undefined;

      console.log(`${color} is no longer the active player`)
    } else {
      //todo pay to other player
    }
  }
})

socket.on("game:propertyCard", (id: number) => {
  if (!game.started) {
    console.error("game not started");
    return;
  }

  if (game.currentPlayerColor === undefined) {
    console.error("no player selected");
    return;
  }

  let property = getPropertyById(id);

  if (property === undefined) {
    console.error("illegal id");
    return;
  }

  let playerByColor = getPlayerByColor(game.currentPlayerColor);

  if (playerByColor === undefined) {
    console.error("player search error");
    return;
  }

  if (!isCardAvailable(id) && !isCardOwnedByCurrentPlayer(id)) {
    const opponent = getPlayerByCard(id);

    if (opponent === undefined) {
      console.error("opponent does not have this card");
      return;
    }

    const inGamePropertyById = getInGamePropertyById(opponent, id)!;

    if (inGamePropertyById.hotelCount === 1) {
      opponent.money += property.rent1Hotel;
      playerByColor.money -= property.rent1Hotel;
    }

    switch (inGamePropertyById.houseCount) {
      case 1: {
        opponent.money += property.rent1House;
        playerByColor.money -= property.rent1House;
        break;
      }
      case 2: {
        opponent.money += property.rent2Houses;
        playerByColor.money -= property.rent2Houses;
        break;
      }
      case 3: {
        opponent.money += property.rent3Houses;
        playerByColor.money -= property.rent3Houses;
        break;
      }
      case 4: {
        opponent.money += property.rent4Houses;
        playerByColor.money -= property.rent4Houses;
        break;
      }
      default: {
        opponent.money += property.rent;
        playerByColor.money -= property.rent;
      }
    }

    console.log(`opponent: ${opponent.money}`)
    console.log(`me: ${playerByColor.money}`)

    return;
  }

  const hasProperty = hasPlayerPropertyCard(playerByColor, id);

  if (!hasProperty) {
    if (playerByColor.money < property.purchasePrice) {
      console.log("you don't have enough money to buy this property");
      return;
    }

    const inGameProperty: InGameProperty = {
      property: property,
      houseCount: 0,
      hotelCount: 0
    }

    playerByColor.cards.properties.push(inGameProperty);
    playerByColor.money -= property.purchasePrice;

    removeCardFromGamePool(id);

    console.log(`you have bought ${property.street}`);
    console.log(`me: ${playerByColor.money}`)
  } else {
    let inGameProperty = getInGamePropertyById(playerByColor, id)!;

    if (inGameProperty.hotelCount === 1) {
      console.log(`you have reached the maximum house/hotel capacity for ${property.street}`)
    } else if (inGameProperty.houseCount + 1 <= 4 && playerByColor.money >= property.housePrice) {
      inGameProperty.houseCount++;

      playerByColor.money -= property.housePrice;

      game.availableHouses -= 1;

      console.log(`you have successfully built a house on ${property.street}`)
      console.log(`me: ${playerByColor.money}`)
    } else if (inGameProperty.houseCount === 4 && playerByColor.money >= property.hotelPrice) {
      inGameProperty.houseCount = 0;
      inGameProperty.hotelCount = 1;

      game.availableHotels -= 1;
      game.availableHotels += 4;

      playerByColor.money -= property.hotelPrice;
      console.log(`me: ${playerByColor.money}`)

      console.log(`you have successfully built a hotel on ${property.street}`)
    } else {
      console.log(`you don't have enough money to buy a house on ${property.street}`);
    }
  }
})

function removeCardFromGamePool(id: number) {
  const index = game.cards.properties.findIndex(
      (property: Property) => property.id === id
  );

  if (index !== -1) {
    game.cards.properties.splice(index, 1);
  }
}

function getPlayerByCard(id: number): Player | undefined {
  return game.players.find((player: Player) =>
      player.cards.properties.some((property: InGameProperty) => property.property.id === id)
  );
}

function getPlayerByColor(color: Color): Player | undefined {
  return game.players.find((player: Player) => player.color === color);
}

function getPropertyById(id: number): Property | undefined {
  return properties.find((property: Property) => property.id === id);
}

function getInGamePropertyById(player: Player, id: number): InGameProperty | undefined {
  return player.cards.properties.find((property: InGameProperty) => property.property.id === id);
}

function hasPlayerPropertyCard(player: Player, id: number): boolean {
  return player.cards.properties.some((property: InGameProperty) => property.property.id === id);
}

function isCardAvailable(id: number): boolean {
  return (
      game.cards.properties.some((property: Property) => property.id === id) ||
      game.cards.lines.some((line: Extra) => line.id === id) ||
      game.cards.companies.some((company: Extra) => company.id === id)
  );
}

function isCardOwnedByCurrentPlayer(id: number): boolean {
  if (!game.started || game.currentPlayerColor === undefined) return false;

  const player = getPlayerByColor(game.currentPlayerColor);
  if (!player) return false;

  return player.cards.properties.some(
      (property: InGameProperty) => property.property.id === id
  );
}


function addPlayer(color: Color) {
  if (checkIfPlayerAlreadyInGame(color)) {
    console.error("player already inGame");
    return;
  }

  const player: Player = {
    cards: {
      lines: [],
      companies: [],
      properties: []
    },
    color: color,
    hasEscapePrisonCard: false,
    money: 500
  }

  game.players.push(player);

  console.log(`added player: ${color} successfully!`)
}

function checkIfPlayerAlreadyInGame(color: Color) {
  return (
      game.players.some((player: Player) => player.color === color)
  );
}

const game: Game = {
  cards: {
    lines: [...lines],
    companies: [...companies],
    properties: [...properties]
  },
  availableHotels: 10,
  availableHouses: 25,
  players: [],
  currentPlayerColor: undefined,
  started: false,
}

</script>

<template>
  <div>
    <h1>app works</h1>
  </div>
</template>
