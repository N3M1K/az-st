import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { GameSession } from "./game/engine";
import { Hex } from "./game/types";
import questionsData from "./game/questions.json";

// Initialize Game Session (Global state for simplicity in this demo)
// In a real app, use a map of session IDs.
let game = new GameSession();

const app = new Elysia()
  .use(html())
  // Serve static files
  .get("/public/*", (ctx) => Bun.file(`src/${ctx.path}`))
  
  // Main Page
  .get("/", () => {
    return `
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AZ Kvíz Remake</title>
    <!-- Tailwind (using CDN for speed/simplicity in this env, or local if build step exists) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              'neon-blue': '#00f3ff',
              'neon-orange': '#ff9900',
            }
          }
        }
      }
    </script>
    <link rel="stylesheet" href="/public/styles.css"> 
    <script src="https://unpkg.com/htmx.org@2.0.4"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js"></script>
    <style>
        /* Fallback for styles.css if not loaded correctly or if tailwind directives fail without build */
        .hex-grid { display: flex; flex-direction: column; align-items: center; margin-top: 5rem; }
        .hex-row { display: flex; justify-content: center; margin-bottom: -18px; }
        .hex { 
            width: 90px; height: 104px; 
            background-color: #1e293b; 
            margin: 0 4px; 
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: all 0.3s;
            position: relative;
        }
        .hex:hover { transform: scale(1.1); z-index: 10; background-color: #334155; }
        .hex-content { font-size: 2rem; font-weight: bold; color: rgba(255,255,255,0.5); }
        .hex.orange { background-color: #ff9900; color: #000; box-shadow: 0 0 15px #ff9900; }
        .hex.blue { background-color: #00f3ff; color: #000; box-shadow: 0 0 15px #00f3ff; }
        .hex.blocked { 
            background-color: #000; 
            box-shadow: inset 0 0 20px #000;
            border: 1px solid #111;
            color: #333; 
            cursor: not-allowed; 
        }
        
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 50; }
        .modal-content { background: #111; border: 1px solid #333; padding: 2rem; border-radius: 1rem; width: 500px; max-width: 90%; color: white; text-align: center; }
    </style>
</head>
<body class="bg-slate-950 text-white min-h-screen overflow-hidden font-sans" 
      x-data="{ modalOpen: false, currentQ: null }"
      @question-loaded.window="modalOpen = true"
      @answer-submitted.window="modalOpen = false">

    <div class="absolute top-4 left-4 text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neon-orange to-neon-blue">
        AZ KVÍZ <span class="text-sm tracking-normal text-slate-500">REMAKE</span>
    </div>

    <!-- Game Status -->
    <div class="absolute top-4 right-4 flex gap-4">
        <div class="px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-500 font-bold"
             id="turn-indicator"
             hx-swap="outerHTML"
             hx-get="/api/turn">
             Player: ${game.currentPlayer.toUpperCase()}
        </div>
        <button class="px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-xs"
                hx-post="/api/reset" hx-target="body">
            RESTART
        </button>
    </div>

    <!-- Hex Grid Container -->
    <div class="hex-grid" id="game-board" hx-get="/api/board" hx-trigger="load">
        <!-- Loaded via HTMX -->
    </div>

    <!-- Question Modal -->
    <div x-show="modalOpen" 
         x-transition.opacity 
         class="modal-overlay" 
         style="display: none;">
         
        <div id="question-modal-content" class="modal-content">
            <!-- Content loaded via HTMX -->
        </div>
    </div>

</body>
</html>
    `;
  })

  // API: Get Board State (HTML Fragment)
  .get("/api/board", () => renderBoard(game))

  // API: Get Turn Indicator
  .get("/api/turn", () => renderTurn(game))

  // API: Reset Game
  .post("/api/reset", () => {
    game = new GameSession();
    return renderBoard(game);
  })

  // API: Handle Hex Click
  .post("/api/hex/:id/click", ({ params }) => {
    const id = parseInt(params.id);
    const question = game.selectHex(id);
    
    if (!question) {
        return ""; 
    }

    // Return HTML for modal content + trigger Alpine event
    // We send a custom header or script to trigger 'question-loaded'
    
    let content = "";
    
    if (question.type === 'boolean') {
        content = `
          <div class="flex flex-col gap-6 items-center">
            <div class="text-6xl font-black text-slate-700 select-none">ANO / NE</div>
            <div class="text-xl font-medium text-center">${question.question}</div>
            
            <div class="flex gap-4 w-full justify-center">
                <form hx-post="/api/answer" hx-target="#game-board" hx-swap="outerHTML" @submit="modalOpen = false" class="w-1/2">
                    <input type="hidden" name="hexId" value="${id}">
                    <input type="hidden" name="answer" value="ano">
                    <button type="submit" class="w-full bg-green-600 hover:bg-green-500 py-4 rounded font-bold text-xl transition-colors">
                        ANO
                    </button>
                </form>
                
                <form hx-post="/api/answer" hx-target="#game-board" hx-swap="outerHTML" @submit="modalOpen = false" class="w-1/2">
                    <input type="hidden" name="hexId" value="${id}">
                    <input type="hidden" name="answer" value="ne">
                    <button type="submit" class="w-full bg-red-600 hover:bg-red-500 py-4 rounded font-bold text-xl transition-colors">
                        NE
                    </button>
                </form>
            </div>
          </div>
        `;
    } else {
        content = `
          <div class="flex flex-col gap-6">
            <div class="text-6xl font-black text-slate-700 select-none">${question.letter}</div>
            <div class="text-xl font-medium">${question.question}</div>
            
            <form hx-post="/api/answer" hx-target="#game-board" hx-swap="outerHTML" 
                  @submit="modalOpen = false"
                  class="flex flex-col gap-4">
                <input type="hidden" name="hexId" value="${id}">
                <input type="text" name="answer" 
                       class="bg-slate-900 border border-slate-700 rounded p-3 text-center text-white focus:border-neon-blue outline-none" 
                       placeholder="Odpověď..." autofocus autocomplete="off">
                <button type="submit" class="bg-slate-800 hover:bg-slate-700 py-2 rounded font-bold transition-colors">
                    POTVRDIT
                </button>
            </form>
          </div>
        `;
    }

    return `
      ${content}
      <script>
        window.dispatchEvent(new CustomEvent('question-loaded'));
      </script>
    `;
  })

  // API: Handle Answer
  .post("/api/answer", ({ body }: any) => {
      const hexId = parseInt(body.hexId);
      const answer = body.answer?.toString() || "";
      
      const question = game.getQuestionForHex(hexId);
      if (!question) return renderBoard(game);

      const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
      const isCorrect = normalize(answer) === normalize(question.answer);
      
      game.submitAnswer(hexId, answer, isCorrect);
      
      return renderBoard(game) + renderTurn(game);
  })

  // --- ADMIN SECTION ---

  // Admin Dashboard
  .get("/admin", () => {
    return `
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AZ Kvíz - Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/htmx.org@2.0.4"></script>
</head>
<body class="bg-gray-900 text-white min-h-screen p-8 font-sans">
    <h1 class="text-3xl font-bold mb-8 text-orange-500">AZ Kvíz - Správa Otázek</h1>
    
    <div class="grid gap-4 max-w-4xl mx-auto">
        ${questionsData.map(q => `
            <form hx-post="/api/admin/questions/${q.id}" hx-swap="none" class="bg-gray-800 p-4 rounded border border-gray-700 flex gap-4 items-center">
                <div class="font-bold text-2xl w-12 text-center text-gray-500">${q.letter}</div>
                <div class="flex-1 space-y-2">
                    <input type="text" name="question" value="${q.question}" class="w-full bg-gray-900 border border-gray-700 p-2 rounded text-sm text-white">
                    <input type="text" name="answer" value="${q.answer}" class="w-full bg-gray-900 border border-gray-700 p-2 rounded text-sm text-green-400 font-bold">
                </div>
                <button type="submit" class="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm font-bold">ULOŽIT</button>
            </form>
        `).join('')}
    </div>
</body>
</html>
    `;
  })

  // API: Update Question
  .post("/api/admin/questions/:id", async ({ params, body }: any) => {
      const id = parseInt(params.id);
      const questionIndex = questionsData.findIndex(q => q.id === id);
      
      if (questionIndex === -1) return new Response("Not found", { status: 404 });
      
      // Update in-memory
      questionsData[questionIndex].question = body.question;
      questionsData[questionIndex].answer = body.answer;
      
      // Save to file
      await Bun.write("src/game/questions.json", JSON.stringify(questionsData, null, 2));
      
      return new Response("Saved", { status: 200 });
  })

  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);

// Helper to render the board HTML
function renderBoard(g: GameSession) {
    let html = '<div class="hex-grid" id="game-board" hx-swap-oob="true">';
    
    // Group hexes by row
    for(let r = 0; r < g.map.rows; r++) {
        html += '<div class="hex-row">';
        const rowHexes = g.map.hexes.filter(h => h.r === r).sort((a,b) => a.q - b.q); // Need to sort by q? q varies.

        for (const hex of rowHexes) {
            let stateClass = "";
            if (hex.state === 'orange') stateClass = "orange";
            else if (hex.state === 'blue') stateClass = "blue";
            else if (hex.state === 'blocked') stateClass = "blocked";
            
            if (g.winner && g.winningHexIds.includes(hex.id)) {
                stateClass += " winning";
            }
            
            // Interaction: only if default/blocked and no winner
            const interaction = ((hex.state === 'default' || hex.state === 'blocked') && !g.winner) 
                ? `hx-post="/api/hex/${hex.id}/click" hx-target="#question-modal-content" hx-swap="innerHTML"` 
                : "";

            html += `
                <div class="hex ${stateClass}" ${interaction}>
                    <div class="hex-content">${hex.letter}</div>
                </div>
            `;
        }
        html += '</div>';
    }
    
    // Check winner overlay
    if (g.winner) {
        html += `
            <div class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                <div class="bg-black/80 p-8 rounded-2xl border-2 border-neon-${g.winner === 'orange' ? 'orange' : 'blue'} 
                     text-6xl font-black text-white animate-bounce shadow-[0_0_100px_currentColor]"
                     style="color: var(--color-neon-${g.winner === 'orange' ? 'orange' : 'blue'})">
                    VYHRÁL ${g.winner.toUpperCase()}!
                </div>
            </div>
        `;
    }

    html += '</div>';
    return html;
}

function renderTurn(g: GameSession) {
    const color = g.currentPlayer === 'orange' ? 'text-orange-500' : 'text-blue-400';
    return `
        <div class="px-4 py-2 rounded-full border border-slate-700 bg-slate-900 ${color} font-bold transition-all"
             id="turn-indicator"
             hx-swap-oob="true">
             NA TAHU: ${g.currentPlayer.toUpperCase()}
        </div>
    `;
}
