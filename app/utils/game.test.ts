import { beforeEach, describe, expect, it } from "vitest";
import { getPropertyById } from "./cards";

describe("Game Setup", () => {
  it("can add players", () => {
    let game = createGame();

    expect(getPlayer(game, "blue")).toBeUndefined();
    expect(getPlayer(game, "red")).toBeUndefined();

    activatePlayerCard(game, "blue");
    activatePlayerCard(game, "red");

    expect(getPlayer(game, "blue")).toBeTruthy();
    expect(getPlayer(game, "red")).toBeTruthy();
    expect(getPlayer(game, "green")).toBeUndefined();
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

  beforeEach(() => {
    game = createGame();

    activatePlayerCard(game, "blue");
    activatePlayerCard(game, "red");
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
    activatePropertyCard(game, 2); // property

    let toBuy = getPropertyById(2)!;

    expect(getActivePlayer(game)?.money).toBe(1500 - toBuy.purchasePrice);
    expect(getActivePlayer(game)?.cards.properties[0]?.property).toBe(toBuy);
    expect(getActivePlayer(game)?.cards.properties[0]?.hotelCount).toBe(0);
    expect(getActivePlayer(game)?.cards.properties[0]?.houseCount).toBe(0);
  });

  it("can buy house", () => {
    activatePlayerCard(game, "blue");
    activatePropertyCard(game, 2); // property

    activatePropertyCard(game, 2); // houses
    activatePropertyCard(game, 2);

    let toBuy = getPropertyById(2)!;

    expect(getActivePlayer(game)?.money).toBe(
      1500 - toBuy.purchasePrice - toBuy.housePrice * 2,
    );

    expect(getActivePlayer(game)?.cards.properties[0]?.property).toBe(toBuy);
    expect(getActivePlayer(game)?.cards.properties[0]?.hotelCount).toBe(0);
    expect(getActivePlayer(game)?.cards.properties[0]?.houseCount).toBe(2);

    expect(game.availableHouses).toBe(30);
  });

  it("can buy hotel", () => {
    activatePlayerCard(game, "blue");
    activatePropertyCard(game, 2); // property

    activatePropertyCard(game, 2); // houses
    activatePropertyCard(game, 2);
    activatePropertyCard(game, 2);
    activatePropertyCard(game, 2);

    activatePropertyCard(game, 2); // hotel

    let toBuy = getPropertyById(2)!;

    expect(getActivePlayer(game)?.money).toBe(
      1500 - toBuy.purchasePrice - toBuy.housePrice * 4 - toBuy.hotelPrice,
    );

    expect(getActivePlayer(game)?.cards.properties[0]?.property).toBe(toBuy);
    expect(getActivePlayer(game)?.cards.properties[0]?.hotelCount).toBe(1);
    expect(getActivePlayer(game)?.cards.properties[0]?.houseCount).toBe(0);

    expect(game.availableHouses).toBe(32);
    expect(game.availableHotels).toBe(7);
  });

  it("can not over buy hotel", () => {
    activatePlayerCard(game, "blue");
    activatePropertyCard(game, 2); // property

    activatePropertyCard(game, 2); // houses
    activatePropertyCard(game, 2);
    activatePropertyCard(game, 2);
    activatePropertyCard(game, 2);

    activatePropertyCard(game, 2); // hotel

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
    activatePropertyCard(game, 2);
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
    activatePropertyCard(game, 2);

    activatePropertyCard(game, 2);
    activatePropertyCard(game, 2);

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
    activatePropertyCard(game, 2);

    activatePropertyCard(game, 2);
    activatePropertyCard(game, 2);
    activatePropertyCard(game, 2);
    activatePropertyCard(game, 2);

    activatePropertyCard(game, 2);

    getActivePlayer(game)!.money = 1500;
    activatePlayerCard(game, "blue");

    activatePlayerCard(game, "red");
    activatePropertyCard(game, 2);

    let property = getPropertyById(2)!;

    expect(getPlayer(game, "red")?.money).toBe(1500 - property.rent1Hotel);
    expect(getPlayer(game, "blue")?.money).toBe(1500 + property.rent1Hotel);
  });
});
