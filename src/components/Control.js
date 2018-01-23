// @flow
import React from 'react';
import AppProperties from '../AppProperties';

const { MOVE } = AppProperties;

type Props = {
  status: {
    safeTeleport: number,
    gameOver: boolean,
  },
  moveCow: string => void,
  initNewGame: () => void,
};
class Control extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.handleMoveClick = this.handleMoveClick.bind(this);
  }

  handleMoveClick: string => () => void;

  handleMoveClick = (move: string) => () => {
    this.props.moveCow(move);
  };

  render() {
    const { gameOver, safeTeleport } = this.props.status;
    const { initNewGame } = this.props;
    return (
      <section className="Control">
        <div>
          <button className="newGame" onClick={initNewGame}>
            New Game
          </button>
        </div>
        <div>
          <button disabled={gameOver} onClick={this.handleMoveClick(MOVE.UP_LEFT)}>
            Up+Left
          </button>
          <button disabled={gameOver} onClick={this.handleMoveClick(MOVE.UP)}>
            Up
          </button>
          <button disabled={gameOver} onClick={this.handleMoveClick(MOVE.UP_RIGHT)}>
            Up+Right
          </button>
        </div>
        <button disabled={gameOver} onClick={this.handleMoveClick(MOVE.LEFT)}>
          Left
        </button>
        <button disabled={gameOver} onClick={this.handleMoveClick(MOVE.RIGHT)}>
          Right
        </button>
        <div>
          <button disabled={gameOver} onClick={this.handleMoveClick(MOVE.DOWN_LEFT)}>
            Down+Left
          </button>
          <button disabled={gameOver} onClick={this.handleMoveClick(MOVE.DOWN)}>
            Down
          </button>
          <button disabled={gameOver} onClick={this.handleMoveClick(MOVE.DOWN_RIGHT)}>
            Down+Right
          </button>
        </div>
        <div>
          <button
            className="teleport"
            disabled={gameOver}
            onClick={this.handleMoveClick(MOVE.TELEPORT)}
          >
            Teleport
          </button>
        </div>
        <div>
          <button
            className="safeTeleport"
            disabled={gameOver || safeTeleport === 0}
            onClick={this.handleMoveClick(MOVE.S_TELEPORT)}
          >
            Safe Teleport
          </button>
        </div>
        <div>
          <button
            className="catchMe"
            disabled={gameOver}
            onClick={this.handleMoveClick(MOVE.CATCH_ME)}
          >
            Catch Me If You Can
          </button>
        </div>
      </section>
    );
  }
}

export default Control;
