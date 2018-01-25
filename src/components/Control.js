// @flow
import React from 'react';
import ArrowDownIcon from 'react-icons/lib/md/arrow-downward';
import ArrowUpIcon from 'react-icons/lib/md/arrow-upward';
import ArrowRightIcon from 'react-icons/lib/md/arrow-forward';
import ArrowLeftIcon from 'react-icons/lib/md/arrow-back';
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
    const rotateIcon = {
      transform: 'rotate(45deg)',
    };
    return (
      <section className="Control">
        <div>
          <button className="newGame" onClick={initNewGame}>
            New Game
          </button>
        </div>
        <div>
          <button disabled={gameOver} onClick={this.handleMoveClick(MOVE.UP_LEFT)}>
            <ArrowLeftIcon size={20} style={rotateIcon} />
          </button>
          <button disabled={gameOver} onClick={this.handleMoveClick(MOVE.UP)}>
            <ArrowUpIcon size={20} />
          </button>
          <button disabled={gameOver} onClick={this.handleMoveClick(MOVE.UP_RIGHT)}>
            <ArrowUpIcon size={20} style={rotateIcon} />
          </button>
        </div>
        <button disabled={gameOver} onClick={this.handleMoveClick(MOVE.LEFT)}>
          <ArrowLeftIcon size={20} />
        </button>
        <button disabled={gameOver} onClick={this.handleMoveClick(MOVE.RIGHT)}>
          <ArrowRightIcon size={20} />
        </button>
        <div>
          <button disabled={gameOver} onClick={this.handleMoveClick(MOVE.DOWN_LEFT)}>
            <ArrowDownIcon size={20} style={rotateIcon} />
          </button>
          <button disabled={gameOver} onClick={this.handleMoveClick(MOVE.DOWN)}>
            <ArrowDownIcon size={20} />
          </button>
          <button disabled={gameOver} onClick={this.handleMoveClick(MOVE.DOWN_RIGHT)}>
            <ArrowRightIcon size={20} style={rotateIcon} />
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
