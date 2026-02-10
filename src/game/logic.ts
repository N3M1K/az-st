import { QUESTIONS, HEX_LETTERS } from './data';

export const gameScript = `
document.addEventListener('alpine:init', () => {
    Alpine.store('game', {
        fields: {}, 
        turn: 'p1',
        scores: { p1: 0, p2: 0 },
        modalOpen: false,
        currentHexId: null,
        currentLetter: null,
        currentQuestion: null,
        answered: false,
        lastAnswerCorrect: false,
        victory: false,
        winner: null,
        winningPath: [],
        
        // Sound effects (synthesized)
        sounds: {
            click: () => {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = 800; 
                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
                osc.start();
                osc.stop(ctx.currentTime + 0.1);
            },
            success: () => {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
                osc.start();
                osc.stop(ctx.currentTime + 0.5);
            },
            failure: () => {
                 const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);
                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
                osc.start();
                osc.stop(ctx.currentTime + 0.4);
            }
        },

        init() {
            // Initialize 28 fields with status and letters
            // We need to pass the letters from backend or define them here. 
            // Since we are in a template string, we can't easily import logic from outer scope unless we inline it or expose it globally.
            // CAUTION: 'import' inside the gameScript string won't work in the browser unless using modules.
            // The user wants simple Bun + Elysia.
            // I should inject the DATA into the script string or window object.
            
            // For now, I'll inline the data or fetch it.
            // better: I will inject \`const HEX_DATA = ${JSON.stringify(HEX_LETTERS)}; const QUESTION_DATA = ${JSON.stringify(QUESTIONS)};\` at the top of the script.
        },
        
        // We will receive injected data, so init just uses it.
        initFields() {
             for(let i=1; i<=28; i++) {
                this.fields[i] = { 
                    status: 'neutral', 
                    id: i,
                    letter: window.HEX_DATA[i] || '?'
                };
            }
        },

        handleHexClick(id) {
            const field = this.fields[id];
            if (field.status !== 'neutral') return;

            this.sounds.click();
            this.currentHexId = id;
            this.currentLetter = field.letter;
            this.currentQuestion = this.getQuestionForLetter(field.letter);
            this.answered = false;
            this.modalOpen = true;
        },

        closeModal() {
            this.modalOpen = false;
            this.currentHexId = null;
        },

        getQuestionForLetter(letter) {
            const candidates = window.QUESTION_DATA.filter(q => q.letter === letter);
            if (candidates.length === 0) return { text: 'Žádná otázka pro toto písmeno.', answer: [''] };
            return candidates[Math.floor(Math.random() * candidates.length)];
        },

        normalize(str) {
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
        },

        verifyAnswer(userText) {
            if (!userText) return;
            
            const normUser = this.normalize(userText);
            const normAnswers = this.currentQuestion.answer.map(a => this.normalize(a));
            
            const isCorrect = normAnswers.includes(normUser);
            this.answer(isCorrect);
        },

        answer(isCorrect) {
            this.answered = true;
            this.lastAnswerCorrect = isCorrect;
            const hexId = this.currentHexId;

            if (isCorrect) this.sounds.success();
            else this.sounds.failure();

            setTimeout(() => {
                if (isCorrect) {
                     this.fields[hexId].status = this.turn;
                     this.scores[this.turn]++;
                     this.checkWin();
                } else {
                     this.fields[hexId].status = 'black'; 
                }
                
                this.turn = this.turn === 'p1' ? 'p2' : 'p1';
                this.closeModal();
            }, 1500); // Slightly longer delay to read feedback
        },

        checkWin() {
            const player = this.turn;
            const playerFields = Object.values(this.fields).filter(f => f.status === player).map(f => f.id);
            
            if (this.checkConnection(playerFields)) {
                this.victory = true;
                this.winner = player;
                this.sounds.success(); 
            }
        },

        resetGame() {
            this.victory = false;
            this.winner = null;
            this.winningPath = [];
            this.turn = 'p1';
            this.scores = { p1: 0, p2: 0 };
            this.modalOpen = false;
            this.initFields(); // Reset fields
        },

        checkConnection(ownedIds) {
            // Adjacency List for Pyramid 1..28
            const adj = {
                1: [2, 3],
                2: [1, 3, 4, 5], 3: [1, 2, 5, 6],
                4: [2, 5, 7, 8], 5: [2, 3, 4, 6, 8, 9], 6: [3, 5, 9, 10],
                7: [4, 8, 11, 12], 8: [4, 5, 7, 9, 12, 13], 9: [5, 6, 8, 10, 13, 14], 10: [6, 9, 14, 15],
                11: [7, 12, 16, 17], 12: [7, 8, 11, 13, 17, 18], 13: [8, 9, 12, 14, 18, 19], 14: [9, 10, 13, 15, 19, 20], 15: [10, 14, 20, 21],
                16: [11, 17, 22, 23], 17: [11, 12, 16, 18, 23, 24], 18: [12, 13, 17, 19, 24, 25], 19: [13, 14, 18, 20, 25, 26], 20: [14, 15, 19, 21, 26, 27], 21: [15, 20, 27, 28],
                22: [16, 23], 23: [16, 17, 22, 24], 24: [17, 18, 23, 25], 25: [18, 19, 24, 26], 26: [19, 20, 25, 27], 27: [20, 21, 26, 28], 28: [21, 27]
            };

            const side1 = [1, 2, 4, 7, 11, 16, 22]; // Left
            const side2 = [1, 3, 6, 10, 15, 21, 28]; // Right
            const side3 = [22, 23, 24, 25, 26, 27, 28]; // Bottom

            // Optimization: Must touch all sides
            if (!ownedIds.some(i => side1.includes(i)) || 
                !ownedIds.some(i => side2.includes(i)) || 
                !ownedIds.some(i => side3.includes(i))) return false;

            const visited = new Set();
            
            for (const id of ownedIds) {
                if (visited.has(id)) continue;
                
                // BFS for Connected Component
                const component = new Set();
                const q = [id];
                
                while (q.length > 0) {
                    const curr = q.pop();
                    if (visited.has(curr)) continue;
                    visited.add(curr);
                    component.add(curr);
                    
                    const neighbors = adj[curr] || [];
                    for (const n of neighbors) {
                        if (ownedIds.includes(n) && !visited.has(n)) {
                            q.push(n);
                        }
                    }
                }
                
                // Check if this specific component connects all 3 sides
                const cArr = Array.from(component);
                const hasS1 = cArr.some(x => side1.includes(x));
                const hasS2 = cArr.some(x => side2.includes(x));
                const hasS3 = cArr.some(x => side3.includes(x));
                
                if (hasS1 && hasS2 && hasS3) {
                    this.winningPath = cArr; // Store winning path
                    return true;
                }
            }
            
            return false;
        }
    });
});
`;
