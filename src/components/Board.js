// @flow
import React from 'react';
import AppProperties from '../AppProperties';
import robotImg from '../media/robot.png';
import cowImg from '../media/cow.png';
import bombImg from '../media/bomb.png';
import appleImg from '../media/apple.png';
import droidImg from '../media/droid.png';
import type { Position, Positions } from '../App';

const { BOARD, KEYBOARD_MOVE, MOVE } = AppProperties;

type Props = {
  status: {
    theme: string,
    safeTeleport: number,
    gameOver: boolean,
  },
  moveCow: string => void,
  cow: Position,
  robots: Positions,
  bombs: Positions,
};
class Board extends React.Component<Props, {}> {
  componentDidMount() {
    this.draw(this.props.status.theme);
    document.addEventListener('keypress', (event) => {
      this.handleKeyPress(event.key);
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    this.draw(nextProps.status.theme);
  }

  handleKeyPress(key: string) {
    if (!this.props.status.gameOver && KEYBOARD_MOVE[key]) {
      if (KEYBOARD_MOVE[key] === MOVE.S_TELEPORT && this.props.status.safeTeleport < 1) {
        return;
      }
      this.props.moveCow(KEYBOARD_MOVE[key]);
    }
  }

  draw(theme: string = 'default') {
    const canvas = document.getElementById('board');
    const ctx = canvas.getContext('2d');
    const robotImage = new Image();
    const cowImage = new Image();
    const bombImage = new Image();
    const getRobotImg = () => {
      switch (theme) {
        case 'mobile':
          return droidImg;
        default:
          return robotImg;
      }
    };
    const getCowImg = () => {
      switch (theme) {
        case 'mobile':
          return appleImg;
        default:
          return cowImg;
      }
    };

    canvas.style.backgroundColor = 'rgba(158, 167, 184, 0.2)';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    robotImage.src = getRobotImg();
    robotImage.onload = () => {
      const { robots } = this.props;
      robots.forEach((robot) => {
        ctx.drawImage(robotImage, robot.x, robot.y);
      });
    };

    bombImage.src = bombImg;
    bombImage.onload = () => {
      const { bombs } = this.props;
      bombs.forEach((bomb) => {
        ctx.drawImage(bombImage, bomb.x, bomb.y);
      });
    };

    cowImage.src = getCowImg();
    cowImage.onload = () => {
      const { cow } = this.props;
      ctx.drawImage(cowImage, cow.x, cow.y);
    };
  }

  render() {
    return (
      <section>
        <canvas id="board" width={BOARD.WIDTH} height={BOARD.HEIGHT}>
          No Canvas available in your browser
        </canvas>
      </section>
    );
  }
}

export default Board;
