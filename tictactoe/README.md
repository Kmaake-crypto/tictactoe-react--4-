# Tic Tac Toe — React HQ Intern Project ✏️

A chalkboard-themed Tic Tac Toe game built with React and `useReducer`.
No Redux, no Zustand, no Context — one reducer is the single source of
truth for the entire game.

**Live demo:** _add your deployed link here_
**Repo:** _add your GitHub link here_

---

## What's implemented (mapped to the rubric)

### 1. Core game (40 marks)
- 3×3 board, X always goes first, turns alternate automatically
- Clicking a filled square (or playing after game-over) is a no-op —
  enforced in the reducer, not just the UI, and triggers a chalk "buzz"
  sound + shake animation for feedback
- Win detection across all 8 lines (rows, columns, diagonals) with a
  glowing, animated chalk strike-through line on the winning row
- Draw detection when the board fills with no winner
- Status text: `"<Name>'s turn"` / `"<Name> wins! 🎉"` / `"It's a draw!"`
- Hover states on empty squares, disabled cursor on filled ones,
  responsive layout (single column on mobile, two-column on desktop)

### 1b. Polish — 3D lighting + sound (added after the base build)
- The board sits inside a CSS perspective, tilted slightly like a real
  chalkboard viewed from a desk, with a soft light source glowing from
  its upper-left corner
- Squares lift toward the viewer on hover (`translateZ`) and gain a
  colored glow the instant they're filled (chalk-yellow for X, chalk-blue
  for O) — that's the "lighting" doing double duty as a visual cue
- On a win, the whole board gets an ambient glow (color-matched) and a
  synthesized victory jingle plays: a sustained bass chord under a short
  melodic fanfare with a shimmer on top — all generated live with the Web
  Audio API (`src/utils/sound.js`), so there's no audio file to host or
  ship — it works identically on any static host
- Every move plays a short "chalk tap" (different pitch for X vs O);
  invalid clicks play a low buzz and shake the square
- A mute toggle (🔊/🔇, top-right) persists to `localStorage`
- Chalk-colored confetti bursts once per win (`src/components/Confetti.jsx`)
- All animations respect `prefers-reduced-motion`

### 2. Manual feature — Scoreboard (15 marks, written by hand, no AI)
`src/components/Scoreboard.jsx` tracks X wins / O wins / draws and
persists them to `localStorage`, so your score survives a page refresh.
A score is only ever awarded **once**, at the exact moment a move makes
the game terminal (see the `MAKE_MOVE` case in `gameReducer.js`) — not on
every render, and not again when you time-travel through history.

I also added a Restart button and an Undo button as extra polish, since
they fall out of the same reducer actions almost for free.

### 3. State management — `useReducer` (20 marks)
Everything lives in one reducer: `src/gameReducer.js`.

| Action | What it does |
|---|---|
| `MAKE_MOVE` | Plays a move, detects win/draw, updates score once |
| `JUMP_TO`   | Time-travels the whole board to any earlier step |
| `UNDO`      | Reverts the last move |
| `RESET_GAME`| Clears the board, keeps scores and player names |
| `RESET_SCORES` | Zeroes the scoreboard |
| `SET_PLAYER_NAME` | Renames X or O |

Design choices, in case you get asked about them on the Loom or in review:
- **Board history is the state**, not a separate "board" + "moves" pair —
  `history` is an array of full board snapshots, and `stepNumber` is just
  a pointer into it. This is what makes both Undo and Time Travel nearly
  free: they're both just "move the pointer / truncate the array."
- **Nothing is duplicated.** Winner, draw, and "whose turn" are never
  stored — they're derived in `App.jsx` from `history[stepNumber]` on
  every render via the pure `calculateWinner` / `isDraw` helpers.
- **Components are dumb.** `Square`, `Board`, `StatusBar`, `Scoreboard`,
  `MoveHistory`, `GameControls`, `PlayerNameForm` take props and call
  callbacks — none of them import the reducer or know an action type
  exists. Only `App.jsx` dispatches.

### 4. Advanced feature — Move History + Time Travel (15 marks)
`src/components/MoveHistory.jsx` lists every move ("Move #3 — X → row 1,
col 2"). Click any entry (including "Game start") and the board jumps
back to that exact state. Play a new move from a past point and the
"future" moves are discarded, just like a real timeline — try it live:
jump back 2 moves, play a new square, and watch the history list shrink
to match.

### 5. Loom video (10 marks) — your turn
Record a screen share, under 4 minutes, face visible in the corner.
Suggested script (~30–45 sec per beat):

1. **Gameplay demo** — play a full game to a win (point out the chalk
   strike-through animation), then Restart and play to a draw.
2. **Manual feature** — show the scoreboard incrementing, refresh the
   page to prove it persists, then hit "Reset scoreboard."
3. **State management tour** — open `gameReducer.js`, scroll past the
   action list, and say out loud: *"Board history is an array of
   snapshots, stepNumber is a pointer into it, and win/draw are derived
   in App.jsx, not stored — so there's nothing to keep in sync."*
4. **Advanced feature** — click a few squares, then click an earlier
   move in the history list to time-travel, then make a new move from
   there and point out the list truncating.

> If a click ever misbehaves mid-recording: pause, breathe, say "we're
> refactoring for scalability," and keep rolling. 😄

### 6. Deployment (10 marks)
See **Deploying** below. Both Netlify and Vercel deploy a Vite app with
zero config from this repo as-is.

---

## Running locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run lint      # oxlint, should report 0 errors
```

## Project structure

```
src/
  gameReducer.js           ← all state + actions (the "brain")
  utils/calculateWinner.js ← pure win/draw detection
  App.jsx                  ← wires reducer to components, derives view state
  App.css / index.css      ← chalkboard theme (CSS variables in index.css)
  components/
    Board.jsx, Square.jsx, WinningLine.jsx
    StatusBar.jsx
    Scoreboard.jsx
    PlayerNameForm.jsx
    GameControls.jsx
    MoveHistory.jsx
```

## Deploying

### Step 1 — push to GitHub
```bash
git init
git add .
git commit -m "Tic Tac Toe: useReducer, scoreboard, time travel"
git branch -M main
git remote add origin https://github.com/<your-username>/tictactoe.git
git push -u origin main
```

### Step 2a — deploy on Netlify (drag-and-drop, fastest)
1. Run `npm run build` locally — this creates a `dist/` folder.
2. Go to app.netlify.com/drop and drag the `dist/` folder in. You'll get
   a live URL in seconds.
3. *(Better long-term option)* Instead: "Add new site" → "Import an
   existing project" → connect GitHub → pick this repo. Netlify
   auto-detects Vite: build command `npm run build`, publish directory
   `dist`. Every push to `main` auto-redeploys.

### Step 2b — deploy on Vercel (equally easy)
1. Go to vercel.com/new and import the GitHub repo.
2. Vercel auto-detects the Vite framework preset — build command
   `npm run build`, output directory `dist`. Click **Deploy**.
3. You get a live `*.vercel.app` URL, redeployed on every push.

Either way, submit the live URL + the GitHub repo link.

## What I'd add with more time
- Minimax "Play vs Computer" mode (the win-detection helper already
  returns everything minimax needs)
- Keyboard navigation between squares (arrow keys + Enter)
- A "share result" button that copies a text summary of the game
