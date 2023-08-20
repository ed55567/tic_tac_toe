import React, { useState, useEffect } from 'react';
import './App.css';

const INITIAL_STATE = {
  currentPlayer: 'X',
  board: Array(9).fill(''),
  gameOver: false,
  winner: '',
  scores: {
    X: 0,
    O: 0,
    ties: 0
  },
  gameMode: '',
  userSymbol: ''
};

const App = () => {
  const [state, setState] = useState(INITIAL_STATE);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (state.gameMode === 'cpu' && state.currentPlayer === 'O' && !state.gameOver) {
      makeMoveCPU();
    }
  }, [state]);

  const handleModeSelect = (mode) => {
    setState({ ...state, gameMode: mode });
  };


  const handleCellClick = (index) => {
    if (!state.board[index] && !state.gameOver) {
      const updatedBoard = [...state.board];
      updatedBoard[index] = state.currentPlayer;

      const winner = checkWinner(updatedBoard);
      const scores = { ...state.scores };

      if (winner) {
        scores[winner]++;
        setState({
          ...state,
          board: updatedBoard,
          gameOver: true,
          winner,
          scores
        });

        setShowModal(true);
      } else if (!updatedBoard.includes('')) {
        scores.ties++;
        setState({
          ...state,
          board: updatedBoard,
          gameOver: true,
          scores
        });
      } else {
        setState({
          ...state,
          board: updatedBoard,
          currentPlayer: state.currentPlayer === 'X' ? 'O' : 'X'
        });
      }
    }
  };

  const makeMoveCPU = () => {
    setTimeout(() => {
      //eslint-disable-next-line
      const emptyCells = state.board.reduce((acc, cell, index) => {
        if (cell === '') {
          acc.push(index);
        }
        return acc;
      }, []);

      const moves = [];
       for (let i = 0; i < emptyCells.length; i++) {
      const move = {};
      move.index = emptyCells[i];
      state.board[emptyCells[i]] = 'O';

      const result = minimax(state.board, 'X');
      move.score = result.score;

      state.board[emptyCells[i]] = '';
      moves.push(move);
    }
  
      
  
      const bestMove = minimax(state.board, 'O').index;
      handleCellClick(bestMove);
    }, 500); // 1-second delay to make it seem like the CPU is "thinking"
  };


  const minimax = (board, player) => {
    const emptyCells = getEmptyCells(board);
  
    if (checkWinner(board) === 'X') {
      return { score: -1 };
    } else if (checkWinner(board) === 'O') {
      return { score: 1 };
    } else if (emptyCells.length === 0) {
      return { score: 0 };
    }
  
    const moves = [];
    for (let i = 0; i < emptyCells.length; i++) {
      const move = {};
      move.index = emptyCells[i];
      board[emptyCells[i]] = player;
  
      if (player === 'O') {
        const result = minimax(board, 'X');
        move.score = result.score;
      } else {
        const result = minimax(board, 'O');
        move.score = result.score;
      }
  
      board[emptyCells[i]] = '';
      moves.push(move);
    }
  
    let bestMove;
    if (player === 'O') {
      let bestScore = Infinity; // Changed to positive infinity
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) { // Changed to prioritize lower score
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = -Infinity; // Changed to negative infinity
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
  
    return moves[bestMove];
  };
  

  const getEmptyCells = (board) => {
    const emptyCells = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        emptyCells.push(i);
      }
    }
    return emptyCells;
  };

  const handleRestart = () => {
    setState(INITIAL_STATE);
  };

  const handleQuit = () => {
    setShowModal(false);
    handleRestart();
  };

  const handleNextRound = () => {
    setShowModal(false);
    setState({
      ...state,
      board: Array(9).fill(''),
      gameOver: false,
      winner: '',
      currentPlayer: 'X'
    });
  };

  const renderCell = (index) => {
    return (
      <div className="cell" onClick={() => handleCellClick(index)}>
        {state.board[index]}
      </div>
    );
  };

  const renderBoard = () => {
    return <div className="board">{state.board.map((cell, index) => renderCell(index))}</div>;
  };

  const checkWinner = (board) => {
    const winningConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let condition of winningConditions) {
      const [a, b, c] = condition;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return null;
  };

  const renderStartMenu = () => {
    return (
      <div className="start-menu">
        <h3>REMEMBER: X GOES FIRST <br>
        </br>X IS ALWAYS PLAYER 1<br>
        </br>O IS ALWAYS PLAYER 2 / CPU</h3>
        <h2>Select Game Mode:</h2>
        <button className="cpu-menu" onClick={() => handleModeSelect('cpu')}>NEW GAME (VS CPU)</button>
        <button className="player-menu" onClick={() => handleModeSelect('player')}>NEW GAME (VS PLAYER)</button>
      </div>
    );
  };



  const renderGameStatus = () => {
    if (state.gameOver) {
      if (state.winner) {
        return (
          <div>
            <div className="modal">
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <div className="modal">
              <p>It&apos;s a tie!</p>
              <button onClick={handleQuit}>Quit</button>
              <button onClick={handleNextRound}>Next Round</button>
            </div>
          </div>
        );
      }
    } else {
      return (
        <div>
          <p>Current Player: {state.currentPlayer === 'X' ? 'Player 1' : 'Player 2'}</p>
          <p>Score:</p>
          <div className="info">
            <p id="x">X: {state.scores.X}</p>
            <p id="ties">Ties: {state.scores.ties}</p>
            <p id="o">O: {state.scores.O}</p>
            
          </div>
        </div>
      );
    }
  };
  
  

  if (!state.gameMode) {
    return (
      <div className="App">
        <h1>Tic Tac Toe</h1>
        {renderStartMenu()}
      </div>
    );
  }


  return (
    <div className="App">
      <h1>Tic Tac Toe</h1>
      <div className="game">
        {renderBoard()}
        <div className="game-status">
          {renderGameStatus()}
        </div>
        <button className="restart" onClick={handleRestart}>Restart</button>
      </div>
      {showModal && (
        <div className="modal">
          <p>{state.winner} TAKES THE ROUND!</p>
          <button onClick={handleQuit}>Quit</button>
          <button onClick={handleNextRound}>Next Round</button>
        </div>
      )}
    </div>
  );
};

export default App;
