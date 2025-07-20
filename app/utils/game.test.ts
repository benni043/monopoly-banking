import { beforeEach, describe, expect, it } from "vitest";
import { getPropertyById } from "./cards";
import { payAndTrade } from "~/utils/game";

describe("Game Setup", () => {
  it("can add players", () => {
    let game = createGame();

    expect(getPlayer(game, "blue")).toBeUndefined();
    expect(getPlayer(game, "red")).toBeUndefined();

    activatePlayerCard(game, "blue");
    activatePlayerCard(game, "red");
    activatePlayerCard(game, "green");

    expect(getPlayer(game, "blue")).toBeTruthy();
    expect(getPlayer(game, "red")).toBeTruthy();
    expect(getPlayer(game, "green")).toBeTruthy();

    expect(getPlayer(game, "yellow")).toBeUndefined();
  });

  it("game has correct defaults", () => {
    let game = createGame();

    expect(getActivePlayer(game)).toBeUndefined();
    expect(game.availableHotels).toBe(8);
    expect(game.availableHouses).toBe(32);

    activatePlayerCard(game, "blue");
    expect(getPlayer(game, "blue")?.money).toBe(1500);
  });
});

describe("Gameplay", () => {
  let game: Game;

  function buyProperty(game: Game, propertyId: number) {
    const money = getActivePlayer(game)!.money;

    activatePropertyCard(game, propertyId); // property

    let toBuy = getPropertyById(propertyId)!;
    let property = getActivePlayer(game)?.cards.properties.find(
      (card) => card.property.id === propertyId,
    );

    expect(getActivePlayer(game)?.money).toBe(money - toBuy.purchasePrice);
    expect(property?.property).toBe(toBuy);
    expect(property?.hotelCount).toBe(0);
    expect(property?.houseCount).toBe(0);
  }

  function buyHouse(game: Game, propertyId: number) {
    let property = getInGamePropertyById(getActivePlayer(game)!, propertyId);

    let houses = property?.houseCount || 0;
    const money = getActivePlayer(game)!.money;
    const availableHouses = game.availableHouses;

    activatePropertyCard(game, propertyId);

    let toBuy = getPropertyById(propertyId)!;
    expect(getActivePlayer(game)?.money).toBe(money - toBuy.housePrice);

    expect(property?.property).toBe(toBuy);
    expect(property?.hotelCount).toBe(0);
    expect(property?.houseCount).toBe(houses + 1);

    expect(game.availableHouses).toBe(availableHouses - 1);
  }

  function buyFullHouse(game: Game, propertyId: number) {
    buyProperty(game, propertyId);
    buyHouse(game, propertyId);
  }

  function buyHotel(game: Game, propertyId: number) {
    let property = getInGamePropertyById(getActivePlayer(game)!, propertyId);

    const money = getActivePlayer(game)!.money;
    const availableHouses = game.availableHouses;
    const availableHotels = game.availableHotels;

    activatePropertyCard(game, propertyId);

    let toBuy = getPropertyById(propertyId)!;
    expect(getActivePlayer(game)?.money).toBe(money - toBuy.hotelPrice);

    expect(property?.property).toBe(toBuy);
    expect(property?.hotelCount).toBe(1);
    expect(property?.houseCount).toBe(0);

    expect(game.availableHouses).toBe(availableHouses + 4);
    expect(game.availableHotels).toBe(availableHotels - 1);
  }

  function buyFullHotel(game: Game, propertyId: number) {
    buyProperty(game, propertyId);
    buyHouse(game, propertyId);
    buyHouse(game, propertyId);
    buyHouse(game, propertyId);
    buyHouse(game, propertyId);
    buyHotel(game, propertyId);
  }

  beforeEach(() => {
    game = createGame();

    activatePlayerCard(game, "blue");
    activatePlayerCard(game, "red");
    activatePlayerCard(game, "yellow");
  });

  it("can activate and deactivate player", () => {
    expect(getActivePlayer(game)).toBeUndefined();
    activatePlayerCard(game, "blue");
    expect(getActivePlayer(game)).toBeTruthy();

    activatePlayerCard(game, "blue");
    expect(getActivePlayer(game)).toBeUndefined();
  });

  it("ignores property if no player is active", () => {
    activatePropertyCard(game, 2);
  });

  it("can buy property", () => {
    activatePlayerCard(game, "blue");
    buyProperty(game, 2);
    buyProperty(game, 5);

    activatePlayerCard(game, "blue");
    activatePlayerCard(game, "red");

    buyProperty(game, 6);
  });

  it("ignores property if no player is active", () => {
    activatePropertyCard(game, 2);

    activatePlayerCard(game, "blue");
    buyProperty(game, 2);
  });

  it("can buy house", () => {
    activatePlayerCard(game, "blue");
    buyFullHouse(game, 2);
    buyHouse(game, 2);
  });

  it("can buy hotel", () => {
    activatePlayerCard(game, "blue");
    buyFullHotel(game, 2);
  });

  it("can not over buy hotel", () => {
    activatePlayerCard(game, "blue");
    buyFullHotel(game, 2);

    activatePropertyCard(game, 2); // to be ignored

    let toBuy = getPropertyById(2)!;

    expect(getPlayer(game, "blue")?.money).toBe(
      1500 - toBuy.purchasePrice - toBuy.housePrice * 4 - toBuy.hotelPrice,
    );

    expect(getPlayer(game, "blue")?.cards.properties[0]?.property).toBe(toBuy);
    expect(getPlayer(game, "blue")?.cards.properties[0]?.hotelCount).toBe(1);
    expect(getPlayer(game, "blue")?.cards.properties[0]?.houseCount).toBe(0);

    expect(game.availableHouses).toBe(32);
    expect(game.availableHotels).toBe(7);
  });

  it("can not buy if to little money", () => {
    activatePlayerCard(game, "blue");

    getActivePlayer(game)!.money = 100;
    activatePropertyCard(game, 2);

    expect(getPlayer(game, "blue")?.money).toBe(100);
    expect(getPlayer(game, "blue")?.cards.properties.length).toBe(0);
  });

  it("can pay rent", () => {
    activatePlayerCard(game, "blue");
    buyProperty(game, 2);

    getActivePlayer(game)!.money = 1500;
    activatePlayerCard(game, "blue");

    activatePlayerCard(game, "red");
    activatePropertyCard(game, 2);

    let property = getPropertyById(2)!;

    expect(getPlayer(game, "red")?.money).toBe(1500 - property.rent);
    expect(getPlayer(game, "blue")?.money).toBe(1500 + property.rent);
  });

  it("can pay rent for house", () => {
    activatePlayerCard(game, "blue");
    buyFullHouse(game, 2);
    buyHouse(game, 2);

    getActivePlayer(game)!.money = 1500;
    activatePlayerCard(game, "blue");

    activatePlayerCard(game, "red");
    activatePropertyCard(game, 2);

    let property = getPropertyById(2)!;

    expect(getPlayer(game, "red")?.money).toBe(1500 - property.rent2Houses);
    expect(getPlayer(game, "blue")?.money).toBe(1500 + property.rent2Houses);
  });

  it("can pay rent for hotel", () => {
    activatePlayerCard(game, "blue");
    buyFullHotel(game, 2);

    getActivePlayer(game)!.money = 1500;
    activatePlayerCard(game, "blue");

    activatePlayerCard(game, "red");
    activatePropertyCard(game, 2);

    let property = getPropertyById(2)!;

    expect(getPlayer(game, "red")?.money).toBe(1500 - property.rent1Hotel);
    expect(getPlayer(game, "blue")?.money).toBe(1500 + property.rent1Hotel);
  });

  it("can trade property from me", () => {
    {
      activatePlayerCard(game, "blue");
      buyFullHouse(game, 2);
      buyFullHouse(game, 5);
      buyFullHouse(game, 40);

      getActivePlayer(game)!.money = 1500;
      {
        activatePlayerCard(game, "red");

        activatePropertyCard(game, 2);
        activatePropertyCard(game, 40);
        payAndTrade(game, 100);
      }
      {
        activatePlayerCard(game, "yellow");

        activatePropertyCard(game, 5);
        payAndTrade(game, 200);
      }
    }

    let property2 = getPropertyById(2)!;
    let property5 = getPropertyById(5)!;
    let property40 = getPropertyById(40)!;

    expect(getPlayer(game, "blue")?.money).toBe(1500 + 100 + 200);
    expect(getPlayer(game, "red")?.money).toBe(1500 - 100);
    expect(getPlayer(game, "yellow")?.money).toBe(1500 - 200);

    expect(getPlayer(game, "blue")?.cards.properties.length).toBe(0);
    expect(getPlayer(game, "red")?.cards.properties.length).toBe(2);
    expect(getInGamePropertyById(getPlayer(game, "red")!, 2)?.property).toBe(
      property2,
    );
    expect(getInGamePropertyById(getPlayer(game, "red")!, 40)?.property).toBe(
      property40,
    );
    expect(getPlayer(game, "yellow")?.cards.properties.length).toBe(1);
    expect(getInGamePropertyById(getPlayer(game, "yellow")!, 5)?.property).toBe(
      property5,
    );
  });

  it("can trade property from other", () => {
    {
      activatePlayerCard(game, "blue");
      buyFullHouse(game, 2);
      buyFullHouse(game, 5);
      buyFullHouse(game, 40);

      getActivePlayer(game)!.money = 1500;

      activatePlayerCard(game, "blue");
      activatePlayerCard(game, "red");
      {
        activatePlayerCard(game, "blue");

        activatePropertyCard(game, 2);
        activatePropertyCard(game, 40);
        payAndTrade(game, 100);
      }
      {
        activatePlayerCard(game, "yellow");

        activatePropertyCard(game, 40);
        payAndTrade(game, 200);
      }
    }

    let property2 = getPropertyById(2)!;
    let property5 = getPropertyById(5)!;
    let property40 = getPropertyById(40)!;

    expect(getPlayer(game, "blue")?.money).toBe(1500 + 100);
    expect(getPlayer(game, "red")?.money).toBe(1500 - 100 + 200);
    expect(getPlayer(game, "yellow")?.money).toBe(1500 - 200);

    expect(getPlayer(game, "blue")?.cards.properties.length).toBe(1);
    expect(getInGamePropertyById(getPlayer(game, "blue")!, 5)?.property).toBe(
      property5,
    );
    expect(getPlayer(game, "red")?.cards.properties.length).toBe(1);
    expect(getInGamePropertyById(getPlayer(game, "red")!, 2)?.property).toBe(
      property2,
    );
    expect(getPlayer(game, "yellow")?.cards.properties.length).toBe(1);
    expect(
      getInGamePropertyById(getPlayer(game, "yellow")!, 40)?.property,
    ).toBe(property40);
  });

  it("cant trade free cards", () => {
    {
      activatePlayerCard(game, "blue");
      buyFullHouse(game, 2);
      buyFullHouse(game, 5);
      buyFullHouse(game, 40);

      getActivePlayer(game)!.money = 1500;
      {
        activatePlayerCard(game, "red");

        activatePropertyCard(game, 2);
        activatePropertyCard(game, 39);
        payAndTrade(game, 100);
      }
    }

    let property2 = getPropertyById(2)!;
    let property5 = getPropertyById(5)!;
    let property40 = getPropertyById(40)!;

    expect(getPlayer(game, "blue")?.money).toBe(1500);
    expect(getPlayer(game, "red")?.money).toBe(1500);

    expect(getPlayer(game, "blue")?.cards.properties.length).toBe(3);
    expect(getInGamePropertyById(getPlayer(game, "blue")!, 2)?.property).toBe(
      property2,
    );
    expect(getInGamePropertyById(getPlayer(game, "blue")!, 5)?.property).toBe(
      property5,
    );
    expect(getInGamePropertyById(getPlayer(game, "blue")!, 40)?.property).toBe(
      property40,
    );

    expect(getPlayer(game, "red")?.cards.properties.length).toBe(0);
  });

  it("cant trade mixed cards", () => {
    {
      activatePlayerCard(game, "blue");
      buyFullHouse(game, 2);

      getActivePlayer(game)!.money = 1500;

      activatePlayerCard(game, "blue");

      activatePlayerCard(game, "red");
      buyFullHouse(game, 12);

      getActivePlayer(game)!.money = 1500;

      {
        activatePlayerCard(game, "blue");

        activatePropertyCard(game, 2);
        activatePropertyCard(game, 12);
        payAndTrade(game, 100);
      }
    }

    let property2 = getPropertyById(2)!;
    let property12 = getPropertyById(12)!;

    expect(getPlayer(game, "blue")?.money).toBe(1500);
    expect(getPlayer(game, "red")?.money).toBe(1500);

    expect(getPlayer(game, "blue")?.cards.properties.length).toBe(1);
    expect(getInGamePropertyById(getPlayer(game, "blue")!, 2)?.property).toBe(
      property2,
    );

    expect(getPlayer(game, "red")?.cards.properties.length).toBe(1);
    expect(getInGamePropertyById(getPlayer(game, "red")!, 12)?.property).toBe(
      property12,
    );
  });

  it("can cancel trade", () => {
    {
      activatePlayerCard(game, "blue");
      buyFullHouse(game, 2);
      buyFullHouse(game, 5);

      getActivePlayer(game)!.money = 1500;
      activatePlayerCard(game, "red");

      activatePlayerCard(game, "blue");
    }

    activatePlayerCard(game, "blue");
    activatePlayerCard(game, "yellow");

    activatePropertyCard(game, 5);
    setTradeAmount(game, 200);

    let property2 = getPropertyById(2)!;
    let property5 = getPropertyById(5)!;

    expect(getPlayer(game, "blue")?.money).toBe(1500 + 200);
    expect(getPlayer(game, "red")?.money).toBe(1500);
    expect(getPlayer(game, "yellow")?.money).toBe(1500 - 200);

    expect(getPlayer(game, "blue")?.cards.properties.length).toBe(1);
    expect(getInGamePropertyById(getPlayer(game, "blue")!, 2)).toBe(property2);
    expect(getPlayer(game, "red")?.cards.properties.length).toBe(0);
    expect(getPlayer(game, "yellow")?.cards.properties.length).toBe(1);
    expect(getInGamePropertyById(getPlayer(game, "yellow")!, 5)).toBe(
      property5,
    );
  });
});
