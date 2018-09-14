import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.click}
    >
      {props.value}
    </button>
  )
}
  
class Board extends React.Component {
  renderSquare(i) {
    let key = 'square-' + i.toString();
    return (
      <Square key={key}
        value={this.props.squares[i]} 
        click={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let outer = [];
    for (let i = 0; i < this.props.nRows; i++) {
      let inner = [];
      for (let j = 0; j < this.props.nRows; j++) {
        inner.push(this.renderSquare(i * this.props.nRows + j));
      }

      let key = 'row-' + i.toString();
      outer.push(
        <div key={key} className="board-row">
          {inner}
        </div>
      );
    }

    return (
      <div>
        {outer}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.nRows = 4
    this.state = {
      history: [{
        squares: Array(this.nRows * this.nRows).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (this.calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  calculateWinner(squares) {
    const lines = [];
    // horizontals
    for (let i = 0; i < this.nRows; i++) {
      lines.push(Array.from(new Array(this.nRows), (x, j) => j + this.nRows * i));
    }

    // verticals
    for (let i = 0; i < this.nRows; i++) {
      lines.push(Array.from(new Array(this.nRows), (x, j) => i + this.nRows * j));
    }

    // diagonals
    lines.push(Array.from(new Array(this.nRows), (x, i) => this.nRows * i + i));
    lines.push(Array.from(new Array(this.nRows), (x, i) => this.nRows * i + (this.nRows - i - 1)));

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c, d] = lines[i];
      if (squares[a] 
          && squares[a] === squares[b] 
          && squares[a] === squares[c]
          && squares[a] === squares[d]) {
        return squares[a];
      }
    }

    return null;
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            nRows={this.nRows}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
