import "./styles.css";
import { useState, useRef } from "react";

const hasWinner = (board) => {
  // the function calculates if game has ended or not

  // check for row
  for (let row of board) {
    let rowSum = row.reduce((prev, cur) => prev + cur);
    if (rowSum === 3 || rowSum === -3) return true;
  }
  // check for col
  for (let i = 0; i < 3; i++) {
    if (
      board[0][i] !== 0 &&
      board[0][i] === board[1][i] &&
      board[1][i] === board[2][i]
    )
      return true;
  }
  // check for diagonal
  if (
    board[1][1] !== 0 &&
    ((board[0][0] === board[1][1] && board[1][1] === board[2][2]) ||
      (board[0][2] === board[1][1] && board[1][1] === board[2][0]))
  )
    return true;
  return false;
};

export default function App() {
  const [board, setBoard] = useState(() =>
    Array.from(Array(3), () => Array(3).fill(0))
  ); // setting up inital board

  const winRef = useRef();

  // state variables for current move, total moves and selected turn

  const [current, setCurrent] = useState(1);
  const [moves, setMoves] = useState(0);
  const [logs, setLogs] = useState([]);
  const [selected, setSelected] = useState([]);


  const makeMove = (r, c) => {
    // make a move on the board according to given condition and updates the number of moves, and update log of moves

    if (winRef.current) return;
    let newBoard = board.map((r) => r.slice());

    if (moves >= 6) {
      if (selected.length) {
        // move a selected element
        let [sR, sC, move] = selected;
        // Not availble for update
        if (
          Math.abs(r - sR) > 1 ||
          Math.abs(c - sC) > 1 ||
          (r === sR && c === sC) ||
          board[r][c] !== 0
        )
          return;
        newBoard[r][c] = move;
        newBoard[sR][sC] = 0;
        setCurrent(-current);
        setSelected([]);
      } else {
        // select an element
        if (board[r][c] === current) {
          setSelected([r, c, board[r][c]]);
        }
        return;
      }
    } else if (board[r][c] === 0) {
      newBoard[r][c] = current;
      setCurrent(-current);
      setMoves((moves) => ++moves);
    }
    let newLogs = logs.map((eBoard) => eBoard.map((eRow) => eRow.slice()));
    newLogs.push(board);
    setLogs(newLogs);
    setBoard(newBoard);
  };

  const renderMove = (col) => {
    // render 'X' and 'O' according to state, 1 -> X, -1 -> O

    if (col === 0) return "";
    if (col === 1) return "X";
    if (col === -1) return "O";
  };

  // Handles the log to help us revert back to a previous state
  const handleLog = (l, i) => {
    let oldLog = logs.map((eBoard) => eBoard.map((eRow) => eRow.slice()));
    let newLog = oldLog.slice(0, i);
    setBoard(l);
    let cur;
    i % 2 === 0 ? (cur = 1) : (cur = -1);

    setCurrent(cur);
    setLogs(newLog);
    setMoves(i);
  };

  return (
    <div className="App">
      {hasWinner(board) ? (
        <div ref={winRef} style={{ fontSize: 32 }}>
          Congratulations {renderMove(-current)} won!
        </div>
      ) : (
        <div style={{ fontSize: 32 }}>{renderMove(current)}'s Turn</div>
      )}
      {board.map((row, rI) => (
        <div className="row" key={rI}>
          {row.map((col, cI) => (
            <div key={cI} className="node" onClick={() => makeMove(rI, cI)}>
              <span style={col === 1 ? { color: "blue", backgroundColor: "white" } : { color: "black", backgroundColor: "white" }}>
                {renderMove(col)}
              </span>
            </div>
          ))}
        </div>
      ))}
      {logs.map((l, i) => (
        <button className="logs" key={i} onClick={() => handleLog(l, i)}>
          Go back to Move #{i}
        </button>
      ))}
    </div>
  );
}