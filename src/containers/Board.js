import React, { Component } from 'react';
import AppProperties from '../AppProperties';
import robotImg from '../media/robot.png';
import cowImg from '../media/cow.png';
import bombImg from '../media/bomb.png';
import appleImg from '../media/apple.png';
import droidImg from '../media/droid.png';
import bananaImg from '../media/banana.png';
import burgerImg from '../media/burger.png';
import goodPokeImg from '../media/pikachu.png';
import badPokeImg from '../media/jigglypuff.png';

const { BOARD, KEYBOARD_MOVE, MOVE } = AppProperties;

class Board extends Component {
    componentDidMount() {
      this.draw(this.props.status.theme);
      document.addEventListener('keypress', (event) => {
        this.handleKeyPress(event.key);
      });
    }
  
    componentWillReceiveProps(nextProps) {
      this.draw(nextProps.status.theme);
    }
    
    handleKeyPress = (key) => {
      if (!this.props.status.gameOver && KEYBOARD_MOVE[key]) {
        if (KEYBOARD_MOVE[key] === MOVE.S_TELEPORT && this.props.status.safeTeleport < 1) {
          return;
        }
        this.props.moveCow(KEYBOARD_MOVE[key]);
      }
    };
  
    draw = (theme = 'default') => {
      console.log(theme);
      var canvas = document.getElementById('board');
      const ctx = canvas.getContext('2d');
      const robotImage = new Image(),
            cowImage = new Image(),
            bombImage = new Image();
      const getRobotImg = (theme) => {
        switch (theme) {
          case 'mobile': return droidImg;
          case 'food': return burgerImg;
          case 'pokemon': return badPokeImg;
          default: return robotImg;
        }
      }
      const getCowImg = (theme) => {
        switch (theme) {
          case 'mobile': return appleImg;
          case 'food': return bananaImg;
          case 'pokemon': return goodPokeImg;
          default: return cowImg;
        }
      }
  
      canvas.style.backgroundColor = 'rgba(158, 167, 184, 0.2)'
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      robotImage.src = getRobotImg(theme);
      robotImage.onload = () => {
        const robots = this.props.robots;
        robots.forEach(robot=>{
          ctx.drawImage(robotImage, robot.x, robot.y);
        });
      };
  
      bombImage.src = bombImg;
      bombImage.onload = () => {
        const bombs = this.props.bombs;
        bombs.forEach(bomb => {
          ctx.drawImage(bombImage, bomb.x, bomb.y);
        });
      };
  
      cowImage.src = getCowImg(theme);
      cowImage.onload = () => {
        const cow = this.props.cow;
        ctx.drawImage(cowImage, cow.x, cow.y)
      };
    };
  
    render() {
      return (
        <section>
          <canvas id="board" width={BOARD.WIDTH} height={BOARD.HEIGHT}>No Canvas available in your browser</canvas>
        </section>
      );
    };  
  }

  export default Board;