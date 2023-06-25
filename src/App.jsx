import React, { useState } from 'react';
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
  }
};

const App = () => {
  const [state, setState] = useState(INITIAL_STATE);

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

  const handleRestart = () => {
    setState(INITIAL_STATE);
  };

  const renderCell = (index) => {
    return (
      <div
        className="cell"
        onClick={() => handleCellClick(index)}
      >
        {state.board[index]}
      </div>
    );
  };

  const renderBoard = () => {
    return (
      <div className="board">
        {state.board.map((cell, index) => renderCell(index))}
      </div>
    );
  };

  const checkWinner = (board) => {
    const winningConditions = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let condition of winningConditions) {
      const [a, b, c] = condition;
      if (
        board[a] &&
        board[a] === board[b] &&
        board[a] === board[c]
      ) {
        return board[a];
      }
    }

    return null;
  };

  const renderGameStatus = () => {
    if (state.gameOver) {
      if (state.winner) {
        return (
          <div>
            <p>{state.winner} TAKES THE ROUND!</p>
            <p>Score:</p>
            <p>X: {state.scores.X}</p>
            <p>O: {state.scores.O}</p>
            <p>Ties: {state.scores.ties}</p>
          </div>
        );
      } else {
        return (
          <div>
            <p>It's a tie!</p>
            <p>Score:</p>
            <p>X: {state.scores.X}</p>
            <p>O: {state.scores.O}</p>
            <p>Ties: {state.scores.ties}</p>
          </div>
        );
      }
    } else {
      return (
        <div>
          <p>Current Player: {state.currentPlayer}</p>
          <p>Score:</p>
          <p>X: {state.scores.X}</p>
          <p>O: {state.scores.O}</p>
          <p>Ties: {state.scores.ties}</p>
        </div>
      );
    }
  };

  return (
    <div className="App">
      <h1>Tic Tac Toe</h1>
      <div className="menu">
        <button onClick={handleRestart}>New Game vs CPU</button>
        <button onClick={handleRestart}>New Game vs Player</button>
      </div>
      <div className="game">
        {renderBoard()}
        <div className="game-status">
          {renderGameStatus()}
        </div>
        <button onClick={handleRestart}>Restart</button>
      </div>
    </div>
  );
};

export default App;
