<script setup lang="ts">

import {io} from "socket.io-client";
import type {Color, Game, Player} from "~/utils/types";
import {companies, lines, properties} from "~/utils/cards";

const socket = io("/", {
  path: "/api/socket.io",
});

socket.on("game:playerCard", (color: Color) => {
  if (!game.started) addPlayer(color)
  else {
    if (game.currentPlayerColor === undefined) {
      game.currentPlayerColor = color;
    } else if (game.currentPlayerColor === color) {
      game.currentPlayerColor = undefined;
    } else {
      //todo pay to other player
    }
  }
})

socket.on("game:propertyCard", (id: number) => {
  if (!game.started) {
    alert("game not started");
    return;
  }

  if (game.currentPlayerColor === undefined) {
    alert("no player selected");
    return;
  }

  let property = getPropertyById(id);

  if (property === undefined) {
    alert("illegal id");
    return;
  }

  let playerByColor = getPlayerByColor(game.currentPlayerColor);

  if (playerByColor === undefined) {
    alert("player search error");
    return;
  }

  if (!isCardAvailable(id)) {
    //todo pay to owner

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

    playerByColor.cards.properties.push(inGameProperty)
  } else {
    let inGameProperty = getInGamePropertyById(playerByColor, id)!;

    if (inGameProperty.houseCount + 1 <= 4 && playerByColor.money >= property.housePrice) {
      inGameProperty.houseCount++;
      return;
    } else if (inGameProperty.houseCount === 4 && playerByColor.money >= property.hotelPrice) {
      inGameProperty.houseCount = 0;
      inGameProperty.hotelCount = 1;
    } else if (inGameProperty.hotelCount === 1) {
      console.log("you have reached the maximum house/hotel capacity")
    } else {
      console.log("you don't have enough money to buy a house");
    }
  }
})

function getPlayerByColor(color: Color): Player | undefined {
  game.players.forEach((player: Player) => {
    if (player.color === color) return player;
  })

  return undefined;
}

function getPropertyById(id: number): Property | undefined {
  game.cards.properties.forEach((property: Property) => {
    if (property.id === id) return property;
  })

  return undefined;
}

function getInGamePropertyById(player: Player, id: number): InGameProperty | undefined {
  player.cards.properties.forEach((property: InGameProperty) => {
    if (property.property.id === id) return property;
  })

  return undefined;
}

function hasPlayerPropertyCard(player: Player, id: number): boolean {
  player.cards.properties.forEach((property: InGameProperty) => {
    if (property.property.id === id) return true;
  })
  return false;
}

function isCardAvailable(id: number): boolean {
  game.cards.properties.forEach((property: Property) => {
    if (property.id === id) return true;
  })

  game.cards.lines.forEach((lines: Extra) => {
    if (lines.id === id) return true;
  })

  game.cards.companies.forEach((company: Extra) => {
    if (company.id === id) return true;
  })

  return false;
}

function addPlayer(color: Color) {
  const player: Player = {
    cards: {
      lines: [],
      companies: [],
      properties: []
    },
    color: color,
    hasEscapePrisonCard: false,
    money: 1500
  }

  game.players.push(player);
}

const game: Game = {
  cards: {
    lines: lines,
    companies: companies,
    properties: properties
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
