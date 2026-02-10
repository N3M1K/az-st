export type Player = 'orange' | 'blue';

export type HexState = 'default' | 'blocked' | 'orange' | 'blue' | 'selected';

export interface Question {
    id: number;
    letter: string;
    question: string;
    answer: string; // The correct answer (normalized for comparison) or "ano"/"ne" for boolean
    type?: 'text' | 'boolean';
    options?: string[]; // Optional for multiple choice if we want, but AZ Kvíz is usually open answer
    category?: string;
}

export interface Hex {
    id: number;
    q: number; // axial coordinates
    r: number;
    state: HexState;
    letter: string; // The letter assigned to this field
}

export interface GameState {
    hexes: Hex[];
    currentPlayer: Player;
    winner: Player | null;
    selectedHexId: number | null;
}
