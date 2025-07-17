export class Game {
  constructor() {}

  activatePlayerCard(color: Color) {
    throw new Error("Method not implemented.");
  }

  activatePropertyCard(id: number) {
    throw new Error("Method not implemented.");
  }

  getPlayer(color: Color): Player | undefined {
    throw new Error("Method not implemented.");
  }

  getActivePlayer(): Player | undefined {
    throw new Error("Method not implemented.");
  }

  getAvailableHouses(): number {
    throw new Error("Method not implemented.");
  }

  getAvailableHotels(): number {
    throw new Error("Method not implemented.");
  }
}
