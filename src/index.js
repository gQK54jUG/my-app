import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
            style={{backgroundColor: props.backgroundColor, fontWeight: props.fontWeight}}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        var backgroundColor = "";
        if (this.props.result !== null) {
            backgroundColor = this.props.result.indexOf(i) === -1 ? "whitesmoke" : "yellow";
        }

        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                backgroundColor={backgroundColor}/>
        );
    }

    render() {
        const boardEdge = this.props.state.boardEdge;

        var renderRoop = () => {
            let square = [];
            for (let i = 0; i < boardEdge; i++) {
                let squareEle = [];
                for (let j = 0; j < boardEdge; j++) {
                    squareEle.push(<a key={j}>{this.renderSquare(j + i * boardEdge)}</a>)
                }
                square.push(<div className="board-row" key={i}>{squareEle}</div>);
            }
            return (<div>{square}</div>);
        }
        return renderRoop();
    }
}

class Game extends React.Component {
    boardEdge = 3;
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(this.boardEdge * this.boardEdge).fill(null)
            }],
            boardEdge: this.boardEdge,
            stepNumber: 0,
            xIsNext: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(move) {
        this.setState({
            stepNumber: move,
            xIsNext: (move % 2) === 0
        });
    }

    sort() {
        this.setState({
            reverse: !this.state.reverse 
        });
    }

    historySquare(stepSquares) {
        let squares = [];
        let squaresEle = [];
        var isNext = this.state.xIsNext ? "X" : "O";

        for (let i in stepSquares) {
            squaresEle.push(<Square key={i} value={stepSquares[i]} fontWeight={isNext === stepSquares[i] ? "bold" : ""}/>);

            if (i % this.boardEdge === this.boardEdge - 1) {
                squares.push(<div key={i} className="board-row">{squaresEle}</div>);
                squaresEle = [];
            }
        }

        return squares;
    }

    render() {
        const history = this.state.history
        const historyForHistories = this.state.reverse ? history.map((_, i, a) => a[a.length - 1 - i]) : history;
        const current = history[this.state.stepNumber];
        const winLines = calculateWinner(current.squares);
        if (winLines === "draw") {
            var status = "Draw!!";
        } else {
            var status = winLines ?
                "Winner: " + (this.state.xIsNext ? "O" : "X") + " !!" : "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

        const histories = historyForHistories.map((step, move) => {
            const move_num = this.state.reverse ? history.length - move - 1 : move;
            const desc = "Go to move #" + move_num;

            if ((move > 0 && !this.state.reverse) || (move !== history.length - 1 && this.state.reverse)) {
                return (
                    <div className="history" key={move_num}>
                        <div key={move_num}>
                            <button onClick={() => this.jumpTo(move_num)}>{desc}</button>
                        </div>
                        {this.historySquare(step.squares)}
                    </div>
                );
            }
        });

        return (
            <div className="game">
                <div className="game-board">
                    <div className="game-info">
                        <div className="status" style={{fontWeight: "bold"}}>{status}</div>
                    </div>
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                        result={winLines}
                        state={this.state}/>
                </div>
                <div>
                    <div className="history">
                        <div>
                            <button style={{backgroundColor: "white"}} onClick={() => this.jumpTo(0)}>
                                Go to game start
                            </button>
                            <button className="sort" onClick={() => this.sort()}>
                                Sort {this.state.reverse ? "↓" : "↑"}
                            </button>
                        </div>
                    </div>
                    {histories}
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Game />, document.getElementById("root")
);

function calculateWinner(squares) {
    console.log(squares);
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
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return lines[i];
    }
    if (squares.find(val => val === null) === undefined) return "draw";
    return null;
}
