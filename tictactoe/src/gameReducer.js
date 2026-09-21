import { calculateWinner, isDraw } from './utils/calculateWinner';

const EMPTY_BOARD = Array(9).fill(null);
const SCORES_KEY = 'tictactoe.scores.v1';
const PLAYERS_KEY = 'tictactoe.players.v1';

function loadScores() {
  try {
    const raw = localStorage.getItem(SCORES_KEY);
    return raw ? JSON.parse(raw) : { X: 0, O: 0, draws: 0 };
  } catch {
    return { X: 0, O: 0, draws: 0 };
  }
}

function loadPlayers() {
  try {
    const raw = localStorage.getItem(PLAYERS_KEY);
    return raw ? JSON.parse(raw) : { X: 'Player X', O: 'Player O' };
  } catch {
    return { X: 'Player X', O: 'Player O' };
  }
}

export function createInitialState() {
  return {
    history: [EMPTY_BOARD],   // array of board snapshots, one per move (index 0 = empty)
    stepNumber: 0,            // which snapshot we're currently viewing/playing from
    players: loadPlayers(),   // display names for X and O
    scores: loadScores(),     // persisted across games in this browser
  };
}

export const ACTIONS = {
  MAKE_MOVE: 'MAKE_MOVE',
  JUMP_TO: 'JUMP_TO',
  UNDO: 'UNDO',
  RESET_GAME: 'RESET_GAME',
  RESET_SCORES: 'RESET_SCORES',
  SET_PLAYER_NAME: 'SET_PLAYER_NAME',
};

export function gameReducer(state, action) {
  switch (action.type) {
    case ACTIONS.MAKE_MOVE: {
      const { index } = action.payload;
      const currentBoard = state.history[state.stepNumber];
      const alreadyOver = calculateWinner(currentBoard) || isDraw(currentBoard);

      // Guard clauses: ignore clicks on filled cells or after the game has ended
      if (alreadyOver || currentBoard[index]) return state;

      const xIsNext = state.stepNumber % 2 === 0;
      const nextBoard = currentBoard.slice();
      nextBoard[index] = xIsNext ? 'X' : 'O';

      // Making a move from a rewound step discards any "future" history —
      // this is what makes time-travel + new moves behave like a real timeline.
      const nextHistory = [...state.history.slice(0, state.stepNumber + 1), nextBoard];
      const nextStep = nextHistory.length - 1;

      // Only award a score the instant the game *becomes* terminal, never on replay.
      const result = calculateWinner(nextBoard);
      let scores = state.scores;
      if (result) {
        scores = { ...state.scores, [result.winner]: state.scores[result.winner] + 1 };
      } else if (isDraw(nextBoard)) {
        scores = { ...state.scores, draws: state.scores.draws + 1 };
      }
      if (scores !== state.scores) {
        try { localStorage.setItem(SCORES_KEY, JSON.stringify(scores)); } catch { /* ignore */ }
      }

      return { ...state, history: nextHistory, stepNumber: nextStep, scores };
    }

    case ACTIONS.JUMP_TO: {
      const step = action.payload.step;
      if (step < 0 || step > state.history.length - 1) return state;
      return { ...state, stepNumber: step };
    }

    case ACTIONS.UNDO: {
      if (state.stepNumber === 0) return state;
      const nextHistory = state.history.slice(0, state.stepNumber);
      return { ...state, history: nextHistory, stepNumber: nextHistory.length - 1 };
    }

    case ACTIONS.RESET_GAME: {
      return { ...state, history: [EMPTY_BOARD], stepNumber: 0 };
    }

    case ACTIONS.RESET_SCORES: {
      const scores = { X: 0, O: 0, draws: 0 };
      try { localStorage.setItem(SCORES_KEY, JSON.stringify(scores)); } catch { /* ignore */ }
      return { ...state, scores };
    }

    case ACTIONS.SET_PLAYER_NAME: {
      const { player, name } = action.payload;
      const players = { ...state.players, [player]: name.trim() || (player === 'X' ? 'Player X' : 'Player O') };
      try { localStorage.setItem(PLAYERS_KEY, JSON.stringify(players)); } catch { /* ignore */ }
      return { ...state, players };
    }

    default:
      return state;
  }
}
