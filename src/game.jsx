import React, { useState,} from 'react';
import ReactDOM from "react-dom";

const App = () => {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [player, setPlayer] = useState("X");
  const [score, setScore] = useState({ X: 0, O: 0, ties: 0 });
  const [gameOver, setGameOver] = useState(false);

  const handleClick = (index) => {
    if (board[index] === "" && !gameOver) {
      const newBoard = [...board];
      newBoard[index] = player;
      setBoard(newBoard);
      setPlayer(player === "X" ? "O" : "X");
      checkWinner(newBoard);
    }
  };

  const checkWinner = (board) => {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let condition of winConditions) {
      const [a, b, c] = condition;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        handleGameEnd(board[a]);
        return;
      }
    }

    if (!board.includes("")) {
      handleGameEnd("tie");
    }
  };

  const handleGameEnd = (winner) => {
    setGameOver(true);
    if (winner === "X" || winner === "O") {
      setScore((prevScore) => ({
        ...prevScore,
        [winner]: prevScore[winner] + 1,
      }));
      alert(`Player ${winner} takes the round!`);
    } else {
      setScore((prevScore) => ({ ...prevScore, ties: prevScore.ties + 1 }));
      alert("It's a tie!");
    }
  };

  const handleRestart = () => {
    setBoard(Array(9).fill(""));
    setPlayer("X");
    setGameOver(false);
  };

  const renderCell = (index) => {
    return (
      <div className="cell" onClick={() => handleClick(index)}>
        {board[index]}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>Tic Tac Toe</h1>
      <div className="menu">
        <button onClick={handleRestart}>New Game vs CPU</button>
        <button onClick={handleRestart}>New Game vs Player</button>
      </div>
      <div className="board">
        {board.map((cell, index) => (
          <div key={index} className="grid">
            {renderCell(index)}
          </div>
        ))}
      </div>
      <div className="scoreboard">
        <div>
          Player X: {score.X} | Player O: {score.O} | Ties: {score.ties}
        </div>
        <div>Turn: {player}</div>
      </div>
      <div className="gameover">
        {gameOver && (
          <div>
            <button onClick={handleRestart}>Next Round</button>
            <button>Quit</button>
          </div>
        )}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
