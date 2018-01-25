// @flow
import React from 'react';
import AppProperties from '../AppProperties';
import robotImg from '../media/robot.png';
import cowImg from '../media/cow.png';
import bombImg from '../media/bomb.png';
import appleImg from '../media/apple.png';
import droidImg from '../media/droid.png';
import type { Position, Positions } from '../App';

const { BOARD } = AppProperties;

type Props = {
  status: {
    theme: string,
    safeTeleport: number,
    gameOver: boolean,
  },
  cow: Position,
  robots: Positions,
  bombs: Positions,
};
class Board extends React.Component<Props, {}> {
  componentDidMount() {
    this.draw(this.props.status.theme);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.draw(nextProps.status.theme);
  }

  canvas: HTMLCanvasElement;

  draw(theme: string = 'default') {
    const ctx = this.canvas.getContext('2d');
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

    this.canvas.style.backgroundColor = 'rgba(158, 167, 184, 0.2)';
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

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
      <canvas
        ref={node => (this.canvas = node)}
        id="board"
        width={BOARD.WIDTH}
        height={BOARD.HEIGHT}
      >
        No Canvas available in your browser
      </canvas>
    );
  }
}

export default Board;
