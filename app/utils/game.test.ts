import { beforeEach, describe, expect, it } from "vitest";
import { Game } from "./game";
import { getPropertyById } from "./cards";

describe("Game Setup", () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
  });

  it("can add players", () => {
    expect(game.getPlayer("blue")).toBeUndefined();
    expect(game.getPlayer("red")).toBeUndefined();

    game.activatePlayerCard("blue");
    game.activatePlayerCard("red");

    expect(game.getPlayer("blue")).toBeTruthy();
    expect(game.getPlayer("red")).toBeTruthy();
    expect(game.getPlayer("green")).toBeUndefined();
  });

  it("game has correct defaults", () => {
    expect(game.getActivePlayer()).toBeUndefined();
    expect(game.getAvailableHotels()).toBe(10);
    expect(game.getAvailableHouses()).toBe(25);

    game.activatePlayerCard("blue");
    expect(game.getPlayer("blue")?.money).toBe(1500);
  });
});

describe("Gameplay", () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();

    game.activatePlayerCard("blue");
    game.activatePlayerCard("red");
  });

  it("can activate and deactivate player", () => {
    expect(game.getActivePlayer()).toBeUndefined();
    game.activatePlayerCard("blue");
    expect(game.getActivePlayer()).toBeTruthy();

    game.activatePlayerCard("blue");
    expect(game.getActivePlayer()).toBeUndefined();
  });

  it("ignores property if no player is active", () => {
    game.activatePropertyCard(2);
  });

  it("can buy property", () => {
    game.activatePlayerCard("blue");
    game.activatePropertyCard(2); // property

    let toBuy = getPropertyById(2)!;

    expect(game.getActivePlayer()?.money).toBe(1500 - toBuy.purchasePrice);
    expect(game.getActivePlayer()?.cards.properties[0]?.property).toBe(toBuy);
    expect(game.getActivePlayer()?.cards.properties[0]?.hotelCount).toBe(0);
    expect(game.getActivePlayer()?.cards.properties[0]?.houseCount).toBe(0);
  });

  it("can buy house", () => {
    game.activatePlayerCard("blue");
    game.activatePropertyCard(2); // property

    game.activatePropertyCard(2); // houses
    game.activatePropertyCard(2);

    let toBuy = getPropertyById(2)!;

    expect(game.getActivePlayer()?.money).toBe(
      1500 - toBuy.purchasePrice - toBuy.housePrice * 2,
    );

    expect(game.getActivePlayer()?.cards.properties[0]?.property).toBe(toBuy);
    expect(game.getActivePlayer()?.cards.properties[0]?.hotelCount).toBe(0);
    expect(game.getActivePlayer()?.cards.properties[0]?.houseCount).toBe(2);

    expect(game.getAvailableHouses()).toBe(23);
  });

  it("can buy hotel", () => {
    game.activatePlayerCard("blue");
    game.activatePropertyCard(2); // property

    game.activatePropertyCard(2); // houses
    game.activatePropertyCard(2);
    game.activatePropertyCard(2);
    game.activatePropertyCard(2);

    game.activatePropertyCard(2); // hotel

    let toBuy = getPropertyById(2)!;

    expect(game.getActivePlayer()?.money).toBe(
      1500 - toBuy.purchasePrice - toBuy.housePrice * 4 - toBuy.hotelPrice,
    );

    expect(game.getActivePlayer()?.cards.properties[0]?.property).toBe(toBuy);
    expect(game.getActivePlayer()?.cards.properties[0]?.hotelCount).toBe(1);
    expect(game.getActivePlayer()?.cards.properties[0]?.houseCount).toBe(0);

    expect(game.getAvailableHouses()).toBe(25);
    expect(game.getAvailableHotels()).toBe(9);
  });

  it("can not over buy hotel", () => {
    game.activatePlayerCard("blue");
    game.activatePropertyCard(2); // property

    game.activatePropertyCard(2); // houses
    game.activatePropertyCard(2);
    game.activatePropertyCard(2);
    game.activatePropertyCard(2);

    game.activatePropertyCard(2); // hotel

    game.activatePropertyCard(2); // to be ignored

    let toBuy = getPropertyById(2)!;

    expect(game.getActivePlayer()?.money).toBe(
      1500 - toBuy.purchasePrice - toBuy.housePrice * 4 - toBuy.hotelPrice,
    );

    expect(game.getActivePlayer()?.cards.properties[0]?.property).toBe(toBuy);
    expect(game.getActivePlayer()?.cards.properties[0]?.hotelCount).toBe(1);
    expect(game.getActivePlayer()?.cards.properties[0]?.houseCount).toBe(0);

    expect(game.getAvailableHouses()).toBe(25);
    expect(game.getAvailableHotels()).toBe(9);
  });

  it("can not buy if to little money", () => {
    game.activatePlayerCard("blue");

    game.getActivePlayer()!.money = 100;
    game.activatePropertyCard(2);

    expect(game.getActivePlayer()?.money).toBe(100);
    expect(game.getActivePlayer()?.cards.properties.length).toBe(0);
  });

  it("can pay rent", () => {
    game.activatePlayerCard("blue");
    game.activatePropertyCard(2);
    game.getActivePlayer()!.money = 1500;
    game.activatePlayerCard("blue");

    game.activatePlayerCard("red");
    game.activatePropertyCard(2);

    let property = getPropertyById(2)!;

    expect(game.getPlayer("red")?.money).toBe(1500 - property.rent);
    expect(game.getPlayer("blue")?.money).toBe(1500 + property.rent);
  });

  it("can pay rent for house", () => {
    game.activatePlayerCard("blue");
    game.activatePropertyCard(2);

    game.activatePropertyCard(2);
    game.activatePropertyCard(2);

    game.getActivePlayer()!.money = 1500;
    game.activatePlayerCard("blue");

    game.activatePlayerCard("red");
    game.activatePropertyCard(2);

    let property = getPropertyById(2)!;

    expect(game.getPlayer("red")?.money).toBe(1500 - property.rent2Houses);
    expect(game.getPlayer("blue")?.money).toBe(1500 + property.rent2Houses);
  });

  it("can pay rent for hotel", () => {
    game.activatePlayerCard("blue");
    game.activatePropertyCard(2);

    game.activatePropertyCard(2);
    game.activatePropertyCard(2);
    game.activatePropertyCard(2);
    game.activatePropertyCard(2);

    game.activatePropertyCard(2);

    game.getActivePlayer()!.money = 1500;
    game.activatePlayerCard("blue");

    game.activatePlayerCard("red");
    game.activatePropertyCard(2);

    let property = getPropertyById(2)!;

    expect(game.getPlayer("red")?.money).toBe(1500 - property.rent1Hotel);
    expect(game.getPlayer("blue")?.money).toBe(1500 + property.rent1Hotel);
  });
});
