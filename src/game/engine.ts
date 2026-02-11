import { Hex, HexState, Player, Question, GameState } from './types';
import questionsData from './questions.json';

export class HexMap {
    hexes: Hex[] = [];
    rows = 7;

    constructor() {
        this.generateMap();
    }

    private generateMap() {
        let id = 0;
        
        for (let r = 0; r < this.rows; r++) {
            for (let q = 0; q <= r; q++) {
                // Assign numbers 1 to 28 sequentially
                const letter = (id + 1).toString();
                
                this.hexes.push({
                    id: id,
                    q: q, // col
                    r: r, // row
                    state: 'default',
                    letter: letter
                });
                id++;
            }
        }
    }

    getHex(id: number): Hex | undefined {
        return this.hexes.find(h => h.id === id);
    }

    getNeighbors(hex: Hex): Hex[] {
        // Neighbors in (row, col) system:
        // (r-1, c-1), (r-1, c)
        // (r, c-1),   (r, c+1)
        // (r+1, c),   (r+1, c+1)
        
        const potential = [
            { r: hex.r - 1, q: hex.q - 1 },
            { r: hex.r - 1, q: hex.q },
            { r: hex.r, q: hex.q - 1 },
            { r: hex.r, q: hex.q + 1 },
            { r: hex.r + 1, q: hex.q },
            { r: hex.r + 1, q: hex.q + 1 }
        ];

        return this.hexes.filter(h => 
            potential.some(p => p.r === h.r && p.q === h.q)
        );
    }

    isSide(hex: Hex, side: 'left' | 'right' | 'bottom'): boolean {
        if (side === 'left') return hex.q === 0;
        if (side === 'right') return hex.q === hex.r;
        if (side === 'bottom') return hex.r === this.rows - 1;
        return false;
    }
}

export class GameSession {
    map: HexMap;
    currentPlayer: Player = 'orange'; // Orange starts usually
    winner: Player | null = null;
    selectedHexId: number | null = null;
    winningHexIds: number[] = [];
    
    constructor() {
        this.map = new HexMap();
        this.currentPlayer = Math.random() < 0.5 ? 'orange' : 'blue';
    }

    getState(): GameState {
        return {
            hexes: this.map.hexes,
            currentPlayer: this.currentPlayer,
            winner: this.winner,
            selectedHexId: this.selectedHexId
        };
    }

    selectHex(id: number): Question | null {
        if (this.winner) return null;
        
        const hex = this.map.getHex(id);
        if (!hex) return null;
        
        // Allow default OR blocked fields
        if (hex.state !== 'default' && hex.state !== 'blocked') return null; 

        this.selectedHexId = id;
        
        // If blocked, serve a boolean question
        if (hex.state === 'blocked') {
            const booleanQuestions = questionsData.filter(q => q.type === 'boolean');
            if (booleanQuestions.length === 0) {
                 // Fallback if no boolean questions
                 return {
                     id: -1,
                     letter: hex.letter,
                     question: "Chyba: Žádné otázky typu Ano/Ne.",
                     answer: "ano",
                     type: 'boolean'
                 } as Question;
            }
            return booleanQuestions[Math.floor(Math.random() * booleanQuestions.length)];
        }
        
        // Standard behavior for default fields
        const matching = questionsData.filter(q => q.letter === hex.letter && (!q.type || q.type === 'text'));
        if (matching.length === 0) {
            const random = questionsData[Math.floor(Math.random() * questionsData.length)];
            return random as Question;
        }
        
        return matching[Math.floor(Math.random() * matching.length)] as Question;
    }

    submitAnswer(hexId: number, answer: string, correct: boolean) {
        if (this.winner) return;
        
        const hex = this.map.getHex(hexId);
        if (!hex) return;

        // Logic for Blocked Field Recovery
        if (hex.state === 'blocked') {
            if (correct) {
                // Correct answer on blocked field -> Current player gets it
                hex.state = this.currentPlayer;
                this.checkWinCondition();
            } else {
                // Incorrect answer on blocked field -> Opponent gets it
                hex.state = this.currentPlayer === 'orange' ? 'blue' : 'orange';
                this.checkWinCondition(); // Opponent might win with this!
            }
            this.selectedHexId = null;
            this.switchPlayer();
            return;
        }

        // Standard Logic
        if (correct) {
            hex.state = this.currentPlayer;
            this.checkWinCondition();
            this.selectedHexId = null;
            // AZ Kviz: Alternating turns.
            if (!this.winner) {
                this.switchPlayer();
            }
        } else {
            hex.state = 'blocked';
            this.selectedHexId = null;
            this.switchPlayer();
        }
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'orange' ? 'blue' : 'orange';
    }

    checkWinCondition() {
        // BFS to see if current player connects all 3 sides
        const p = this.currentPlayer;
        const playerHexes = this.map.hexes.filter(h => h.state === p);
        
        if (playerHexes.length < 3) return; // Minimum 3 to bridge

        // We need to find a connected component that touches Left, Right, and Bottom.
        // Let's iterate through each hex, if unvisited, run BFS/DFS.
        
        const visited = new Set<number>();
        
        for (const startHex of playerHexes) {
            if (visited.has(startHex.id)) continue;
            
            const component: Hex[] = [];
            const queue = [startHex];
            visited.add(startHex.id);
            
            let touchedLeft = false;
            let touchedRight = false;
            let touchedBottom = false;

            while (queue.length > 0) {
                const current = queue.shift()!;
                component.push(current);

                if (this.map.isSide(current, 'left')) touchedLeft = true;
                if (this.map.isSide(current, 'right')) touchedRight = true;
                if (this.map.isSide(current, 'bottom')) touchedBottom = true;

                const neighbors = this.map.getNeighbors(current);
                for (const n of neighbors) {
                    if (n.state === p && !visited.has(n.id)) {
                        visited.add(n.id);
                        queue.push(n);
                    }
                }
            }

            if (touchedLeft && touchedRight && touchedBottom) {
                this.winner = p;
                this.winningHexIds = component.map(h => h.id);
                return;
            }
        }
    }
    
    // Helper to get question by ID if needed, or by letter
    getQuestionForHex(hexId: number): Question | undefined {
         const hex = this.map.getHex(hexId);
         if (!hex) return undefined;
         // Logic to get deterministic but random question
         // For now just return random
         const matching = questionsData.filter(q => q.letter === hex.letter);
         return matching.length > 0 ? matching[0] : questionsData[0];
    }
}
