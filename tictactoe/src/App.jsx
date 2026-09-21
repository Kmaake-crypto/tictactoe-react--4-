import { useEffect, useReducer, useRef, useState } from 'react';
import { gameReducer, createInitialState, ACTIONS } from './gameReducer';
import { calculateWinner, isDraw } from './utils/calculateWinner';
import { initSoundPreference, setMuted, playWin, playDraw } from './utils/sound';
import { createConfettiBurst } from './utils/confetti';
import Board from './components/Board';
import StatusBar from './components/StatusBar';
import Scoreboard from './components/Scoreboard';
import PlayerNameForm from './components/PlayerNameForm';
import GameControls from './components/GameControls';
import MoveHistory from './components/MoveHistory';
import Confetti from './components/Confetti';
import './App.css';

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const { history, stepNumber, players, scores } = state;

  const [muted, setMutedState] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState([]);
  const previousHistoryLength = useRef(history.length);
  const burstCounter = useRef(0);

  // Restore the mute preference once, on first mount.
  useEffect(() => {
    setMutedState(initSoundPreference());
  }, []);

  // Everything below is *derived* from state — nothing here is duplicated storage,
  // it's all computed fresh from the single source of truth on every render.
  const currentBoard = history[stepNumber];
  const result = calculateWinner(currentBoard);
  const draw = !result && isDraw(currentBoard);
  const xIsNext = stepNumber % 2 === 0;
  const gameOver = Boolean(result) || draw;
  const viewingPastMove = stepNumber !== history.length - 1;

  const winner = result ? { symbol: result.winner, name: players[result.winner] } : null;

  // Fire the win/draw celebration exactly once — only when a fresh MAKE_MOVE
  // just ended the game, never while browsing history or on re-render.
  useEffect(() => {
    const isNewMove = history.length > previousHistoryLength.current;
    previousHistoryLength.current = history.length;
    if (!isNewMove) return;

    if (result) {
      playWin();
      burstCounter.current += 1;
      setConfettiPieces(createConfettiBurst(burstCounter.current));
    } else if (draw) {
      playDraw();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.length, result?.winner, draw]);

  const handleSquareClick = (index) => {
    dispatch({ type: ACTIONS.MAKE_MOVE, payload: { index } });
  };

  const handleRestart = () => dispatch({ type: ACTIONS.RESET_GAME });
  const handleUndo = () => dispatch({ type: ACTIONS.UNDO });
  const handleResetScores = () => dispatch({ type: ACTIONS.RESET_SCORES });
  const handleJumpTo = (step) => dispatch({ type: ACTIONS.JUMP_TO, payload: { step } });
  const handleNameChange = (player, name) =>
    dispatch({ type: ACTIONS.SET_PLAYER_NAME, payload: { player, name } });
  const handleToggleMute = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
  };

  return (
    <div className={`app${winner ? ' app--celebrate' : ''}${draw ? ' app--draw' : ''}`}>
      <Confetti pieces={confettiPieces} />

      <header className="app__header">
        <button
          className="mute-toggle"
          onClick={handleToggleMute}
          aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
          title={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? '🔇' : '🔊'}
        </button>
        <p className="app__eyebrow">best game</p>
        <h1 className="app__title">Tic&nbsp;Tac&nbsp;Toe</h1>
      </header>

      <div className="layout">
        <div className="layout__game">
          <PlayerNameForm players={players} onNameChange={handleNameChange} disabled={stepNumber > 0} />

          <StatusBar
            winner={winner}
            draw={draw}
            nextPlayerName={players[xIsNext ? 'X' : 'O']}
            nextPlayerSymbol={xIsNext ? 'X' : 'O'}
          />

          {viewingPastMove && (
            <p className="rewind-banner">
              Viewing move #{stepNumber} from history — make a move to continue from here.
            </p>
          )}

          <Board
            squares={currentBoard}
            onSquareClick={handleSquareClick}
            winningLine={result?.line}
            gameOver={gameOver}
            xIsNext={xIsNext}
          />

          <GameControls onRestart={handleRestart} onUndo={handleUndo} canUndo={stepNumber > 0} />
        </div>

        <div className="layout__side">
          <Scoreboard scores={scores} players={players} onResetScores={handleResetScores} />
          <MoveHistory history={history} stepNumber={stepNumber} onJumpTo={handleJumpTo} />
        </div>
      </div>

      <footer className="app__footer">
        Built with React · useReducer · no external state library
      </footer>
    </div>
  );
}
