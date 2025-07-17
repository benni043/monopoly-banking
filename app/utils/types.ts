export interface Property {
    id: number;
    color: string;
    state: string;
    street: string;
    rent: number;
    rent1House: number;
    rent2Houses: number;
    rent3Houses: number;
    rent4Houses: number;
    rent1Hotel: number;
    purchasePrice: number;
    housePrice: number;
    hotelPrice: number;
}

export interface Extra {
    id: number;
    type: string
    name: string;
}

export interface Game {
    player1: Player;
    player2: Player;
    player3: Player | undefined;
    player4: Player | undefined;
    cards: {
        properties: Property[];
        companies: Extra[];
        lines: Extra[];
    };
    availableHouses: number;
    availableHotels: number;
}

export interface Player {
    color: Color;
    cards: {
        properties: InGameProperty[];
        companies: Extra[];
        lines: Extra[];
    };
    money: number;
    hasEscapePrisonCard: boolean
}

export interface InGameProperty {
    property: Property;
    houseCount: number;
    hotelCount: number;
}

export type Color = "green" | "yellow" | "red" | "blue";
