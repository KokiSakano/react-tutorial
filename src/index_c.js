import React from "react";
import ReactDOM from "react-dom";
import { createPortal } from "react-dom/cjs/react-dom.development";

import "./index.css";

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                key={i}
            />
        );
    }

    render() {
        const squareBoard = [];
        for(let i=0; i<3; i++){
            let rowBoard = [];
            for(let j=0;j<3; j++){
                rowBoard.push(this.renderSquare(j+3*i));
            }
            squareBoard.push(
                <div className="board-row" key={i}>
                    {rowBoard}
                </div>
            )
        }
        return (
            <div>
                {squareBoard}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null)
                }
            ],
            stepNumber: 0,
            xIsNext: true,
            ascending: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares)[0] || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const stepNum = this.state.stepNumber;
        const current = history[stepNum];
        const arrWin = calculateWinner(current.squares);
        const winner = arrWin[0];
        const winState = arrWin[1];

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {move === stepNum
                            ? <b>{desc}</b>
                            : desc
                        }
                    </button>
                </li>
            );
        });

        let status;
        if (winner === "draw") {
            status = "Draw";
        } else if (winner) {
            status = "Winner: " + winner;
            for(let i=0; i<3; i++){
                current.squares[winState[i]] = <font color="#F00">{current.squares[winState[i]]}</font>;
            }
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

        if(! this.state.ascending) moves.reverse();
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button
                        onClick={() => {this.setState({ascending:true,});}}>
                        {"昇順"}
                    </button>
                    <button
                        onClick={() => {this.setState({ascending:false,});}}>
                        {"降順"}
                    </button>
                    <ol>
                        {moves}
                    </ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [squares[a], lines[i]];
        }
    }

    if (squares.indexOf(null) === -1) return ["draw", []];

    return [null, []];
}
