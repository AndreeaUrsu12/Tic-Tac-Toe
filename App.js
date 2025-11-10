// Adăugăm useRef și useEffect la importuri
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';

// Emojis pentru jucători
const PLAYER_X_SYMBOL = '😊';
const PLAYER_O_SYMBOL = '🥳';

// Funcția calculateWinner
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  const isDraw = squares.every(square => square !== null);
  if (isDraw) {
    return { winner: 'Draw', line: null };
  }
  return null;
}

// Componenta Square 
function Square({ value, onSquareClick, isWinnerSquare }) {
  let className = "square";
  if (isWinnerSquare) {
    className += " winner";
  } else if (value) {
    className += " occupied";
  }
  return (
    <button 
      className={className} 
      onClick={onSquareClick} 
      disabled={!!value}
    >
      {value}
    </button>
  );
}

// Componenta Tablă (Board) 
function Board({ xIsNext, squares, onPlay }) {
  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const winningLine = winnerInfo ? winnerInfo.line : [];
  
  //  referință pentru elementul de status
  const statusRef = useRef(null);

  const handleClick = useCallback((i) => {
    if (winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? PLAYER_X_SYMBOL : PLAYER_O_SYMBOL;
    onPlay(nextSquares);
  }, [xIsNext, squares, winner, onPlay]);

  // Hook-ul useEffect va rula de fiecare dată când 'winner' se schimbă
  useEffect(() => {
    // Verificăm dacă elementul de status există
    if (!statusRef.current) {
      return;
    }

    // Definim animațiile în JS
    if (winner === 'Draw') {
      // Animația "pulse"
      statusRef.current.animate(
        [
          { opacity: 1 },
          { opacity: 0.5 },
          { opacity: 1 }
        ],
        {
          duration: 2000,
          iterations: Infinity,
          easing: 'cubic-bezier(0.4, 0, 0.6, 1)'
        }
      );
    } else if (winner) {
      // Animația "bounce"
      statusRef.current.animate(
        [
          { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
          { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
          { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' }
        ],
        {
          duration: 1000,
          iterations: Infinity
        }
      );
    }
    
    // Acest efect depinde de starea 'winner'
  }, [winner]);


  const status = useMemo(() => {
    if (winner === 'Draw') {
      return (
        // Aplicăm ref-ul aici
        <span ref={statusRef} className="status-draw">
          Egalitate! 🤝
        </span>
      );
    }
    if (winner) {
      return (
        // Aplicăm ref-ul și aici
        <span ref={statusRef} className="status-winner">
          Câștigător: {winner} 🎉
        </span>
      );
    }
    return (
      <span className="status-next">
        Următorul jucător: {xIsNext ? PLAYER_X_SYMBOL : PLAYER_O_SYMBOL}
      </span>
    );
  }, [winner, xIsNext]);

  // Generează tabla de joc (neschimbat)
  const renderBoard = () => {
    let board = [];
    for (let i = 0; i < 9; i += 3) {
      const row = [];
      for (let j = 0; j < 3; j++) {
        const index = i + j;
        row.push(
          <Square 
            key={index} 
            value={squares[index]} 
            onSquareClick={() => handleClick(index)} 
            isWinnerSquare={winningLine && winningLine.includes(index)}
          />
        );
      }
      board.push(
        <div key={i} className="board-row">
          {row}
        </div>
      );
    }
    return board;
  };

  return (
    <>
      <div className="status-container">{status}</div>
      <div className="board-grid">
        {renderBoard()}
      </div>
    </>
  );
}

// Componenta principală Game (neschimbată)
export default function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const handlePlay = useCallback((nextSquares) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }, [history, currentMove]);

  const jumpTo = (nextMove) => {
    setCurrentMove(nextMove);
  };

  const moves = history.map((squares, move) => {
    const description = move === 0 
      ? 'Începe jocul 🚀'
      : `Mergi la mutarea #${move}`;
    
    const isCurrent = move === currentMove;
    
    return (
      <li key={move} className="history-item">
        <button 
          onClick={() => jumpTo(move)}
          className={`history-button ${isCurrent ? 'current' : ''}`}
        >
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="app-container">
      <h1 className="app-title">
        Tic-Tac-Toe Emoji 🟢
      </h1>
      
      <div className="game-layout">
        <div className="game-board-container">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info-container">
          <h2 className="history-title">
            Istoric Mutări
          </h2>
          <ol className="history-list">
            {moves}
          </ol>
        </div>
      </div>
    </div>
  );
}
