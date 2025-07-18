import {companies, lines, properties, getPropertyById} from "./cards";
import type {Color, Player, InGameProperty} from "./types";

export class Game {
    players: Player[] = [];
    availableHotels = 8;
    availableHouses = 32;
    currentPlayerColor: Color | undefined;
    started = false;

    cards = {
        lines: [...lines],
        companies: [...companies],
        properties: [...properties],
    };

    constructor() {
    }

    activatePlayerCard(color: Color) {
        if (!this.started) {
            if (this.checkIfPlayerAlreadyInGame(color)) {
                console.error("player already inGame");
                return;
            }

            const player: Player = {
                cards: {
                    lines: [],
                    companies: [],
                    properties: [],
                },
                color: color,
                hasEscapePrisonCard: false,
                money: 1500,
            };

            this.players.push(player);

            console.log(`added player: ${color} successfully!`);

            //todo wait a few seconds after each player and then start
            if (this.players.length >= 2) this.started = true;
            return;
        }

        if (this.currentPlayerColor === undefined) {
            this.currentPlayerColor = color;

            console.log(`${color} is now the active player`);
        } else if (this.currentPlayerColor === color) {
            this.currentPlayerColor = undefined;

            console.log(`${color} is no longer the active player`);
        } else {
            // TODO: implement payment to other player
            console.log("Should pay the other player");
        }
    }

    activatePropertyCard(id: number) {
        if (!this.started) {
            console.error("game not started");
            return;
        }

        if (this.currentPlayerColor === undefined) {
            console.error("no player selected");
            return;
        }

        const property = getPropertyById(id);
        if (!property) {
            console.error("illegal id");
            return;
        }

        const currentPlayer = this.getPlayer(this.currentPlayerColor);
        if (!currentPlayer) {
            console.error("player search error");
            return;
        }

        //property is owned by other player
        if (!this.isCardAvailable(id) && !this.isCardOwnedByCurrentPlayer(id)) {
            const opponent = this.getPlayerByCard(id);
            if (!opponent) {
                console.error("opponent does not have this card");
                return;
            }

            const inGameProperty = this.getInGamePropertyById(opponent, id)!;

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

        const hasProperty = this.hasPlayerPropertyCard(currentPlayer, id);

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
            this.removeCardFromGamePool(id);

            console.log(`you have bought ${property.street}`);
            console.log(`me: ${currentPlayer.money}`);

            return;
        }

        //player owns property
        const inGameProperty = this.getInGamePropertyById(currentPlayer, id)!;

        if (inGameProperty.hotelCount === 1) {
            console.log(`you have reached the maximum house/hotel capacity for ${property.street}`);
        } else if (inGameProperty.houseCount + 1 <= 4 && currentPlayer.money >= property.housePrice) {
            inGameProperty.houseCount++;
            currentPlayer.money -= property.housePrice;
            this.availableHouses--;

            console.log(`you have successfully built a house on ${property.street}`);
            console.log(`me: ${currentPlayer.money}`);
        } else if (inGameProperty.houseCount === 4 && currentPlayer.money >= property.hotelPrice) {
            inGameProperty.houseCount = 0;
            inGameProperty.hotelCount = 1;

            this.availableHotels--;
            this.availableHouses += 4;

            currentPlayer.money -= property.hotelPrice;

            console.log(`you have successfully built a hotel on ${property.street}`);
            console.log(`me: ${currentPlayer.money}`);
        } else {
            console.log(`you don't have enough money to buy a house on ${property.street}`);
        }
    }

    getPlayer(color: Color): Player | undefined {
        return this.players.find((p) => p.color === color);
    }

    getActivePlayer(): Player | undefined {
        return this.currentPlayerColor ? this.getPlayer(this.currentPlayerColor) : undefined;
    }

    getAvailableHouses(): number {
        return this.availableHouses;
    }

    getAvailableHotels(): number {
        return this.availableHotels;
    }

    //internal helpers
    private getPlayerByCard(id: number): Player | undefined {
        return this.players.find((player) =>
            player.cards.properties.some((property) => property.property.id === id)
        );
    }

    private getInGamePropertyById(player: Player, id: number): InGameProperty | undefined {
        return player.cards.properties.find((property) => property.property.id === id);
    }

    private hasPlayerPropertyCard(player: Player, id: number): boolean {
        return player.cards.properties.some((property) => property.property.id === id);
    }

    private isCardAvailable(id: number): boolean {
        return (
            this.cards.properties.some((p) => p.id === id) ||
            this.cards.lines.some((c) => c.id === id) ||
            this.cards.companies.some((c) => c.id === id)
        );
    }

    private isCardOwnedByCurrentPlayer(id: number): boolean {
        if (!this.started || this.currentPlayerColor === undefined) return false;
        const player = this.getPlayer(this.currentPlayerColor);
        if (!player) return false;

        return player.cards.properties.some((p) => p.property.id === id);
    }

    private checkIfPlayerAlreadyInGame(color: Color): boolean {
        return this.players.some((p) => p.color === color);
    }

    private removeCardFromGamePool(id: number) {
        const index = this.cards.properties.findIndex((p) => p.id === id);
        if (index !== -1) this.cards.properties.splice(index, 1);
    }
}
