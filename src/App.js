import React, { Component } from 'react';
import robotImg from './robot.png';
import cowImg from './cow.png';
import bombImg from './bomb.png';
import cowLogo from './cow-full.png';
import { findIndex, findLastIndex } from 'lodash';
import './App.css';

const MOVE = {
    UP:         'UP',
    DOWN:       'DOWN',
    LEFT:       'LEFT',
    RIGHT:      'RIGHT',
    UP_LEFT:    'UP_LEFT',
    UP_RIGHT:   'UP_RIGHT',
    DOWN_LEFT:  'DOWN_LEFT',
    DOWN_RIGHT: 'DOWN_RIGHT',
    TELEPORT:   'TELEPORT'
};

const MOVE_SIZE = 40;
const BOARD = {
  WIDTH: 1000,
  HEIGHT: 600
};

class Board extends Component {
  componentDidMount() {
    this.draw();
  }

  componentWillReceiveProps() {
    this.draw();
  }
  
  draw = () => {
    var canvas = document.getElementById('board');
    const ctx = canvas.getContext('2d');
    const robotImage = new Image(),
          cowImage = new Image(),
          bombImage = new Image();

    canvas.style.backgroundColor = 'rgba(158, 167, 184, 0.2)'
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    robotImage.src = robotImg;
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

    cowImage.src = cowImg;
    cowImage.onload = () => {
      const cow = this.props.cow;
      ctx.drawImage(cowImage, cow.x, cow.y)
    };
  };

  render() {
    return (
      <canvas id="board" width={BOARD.WIDTH} height={BOARD.HEIGHT}>Your browser doesn't support HTML5 Canvas</canvas>
    );
  }  
}

class Control extends Component {
  handleMoveClick = (event) => {
    this.props.moveCow(event.currentTarget.value);
  };

  render() {
    return (
      <section>
        <div>
          <button value={MOVE.UP_LEFT} onClick={this.handleMoveClick}>Up+Left</button>
          <button value={MOVE.UP} onClick={this.handleMoveClick}>Up</button>
          <button value={MOVE.UP_RIGHT} onClick={this.handleMoveClick}>Up+Right</button>
        </div>
        <button value={MOVE.LEFT} onClick={this.handleMoveClick}>Left</button>
          <span>&emsp;&emsp;&emsp;</span>
        <button value={MOVE.RIGHT} onClick={this.handleMoveClick}>Right
        </button>
        <div>
          <button value={MOVE.DOWN_LEFT} onClick={this.handleMoveClick}>Down+Left</button>          
          <button value={MOVE.DOWN} onClick={this.handleMoveClick}>Down</button>
          <button value={MOVE.DOWN_RIGHT} onClick={this.handleMoveClick}>Down+Right</button>
        </div>
        <div>
          <button value={MOVE.TELEPORT} onClick={this.handleMoveClick}>Teleport</button>
        </div>
      </section>
    );
  }
};

const genRoboPos = (level) => {
  return ([
     { x:40, y:200 }, { x: 400, y: 40 }, { x:400, y:320 }, { x:400, y:240 }
  ]);  
};

class App extends Component {
  state = {
    robots: genRoboPos(1),
    cow: { x:480, y:280 },
    bombs: [],
    gameOver: false
  }

  calcCowPos = (cow, dir) => {
    const newCow = {};
    newCow[MOVE.UP]         = { x: cow.x, y: cow.y - MOVE_SIZE < 0 ? cow.y : cow.y - MOVE_SIZE };
    newCow[MOVE.DOWN]       = { x: cow.x, y: cow.y + MOVE_SIZE < BOARD.HEIGHT ? cow.y + MOVE_SIZE : cow.y };
    newCow[MOVE.RIGHT]      = { x: cow.x + MOVE_SIZE < BOARD.WIDTH ? cow.x + MOVE_SIZE : cow.x, y: cow.y };
    newCow[MOVE.LEFT]       = { x: cow.x - MOVE_SIZE < 0 ? cow.x : cow.x - MOVE_SIZE,
                                y: cow.y };
    newCow[MOVE.UP_LEFT]    = { x: cow.x - MOVE_SIZE < 0 ? cow.x : cow.x - MOVE_SIZE,
                                y: cow.y - MOVE_SIZE < 0 ? cow.y : cow.y - MOVE_SIZE };
    newCow[MOVE.UP_RIGHT]   = { x: cow.x + MOVE_SIZE < BOARD.WIDTH ? cow.x + MOVE_SIZE : cow.x,
                                y: cow.y - MOVE_SIZE < 0 ? cow.y : cow.y - MOVE_SIZE };
    newCow[MOVE.DOWN_LEFT]  = { x: cow.x - MOVE_SIZE < 0 ? cow.x : cow.x - MOVE_SIZE,
                                y: cow.y + MOVE_SIZE < BOARD.HEIGHT ? cow.y + MOVE_SIZE : cow.y };
    newCow[MOVE.DOWN_RIGHT] = { x: cow.x + MOVE_SIZE < BOARD.WIDTH ? cow.x + MOVE_SIZE : cow.x, 
                                y: cow.y + MOVE_SIZE < BOARD.HEIGHT ? cow.y + MOVE_SIZE : cow.y };

    return newCow[dir];
  };

  moveCow = (dir) => {
    const newCowPos = this.calcCowPos(this.state.cow, dir);
    this.setState(prevState => ({
      cow: newCowPos
    }), this.moveRobots);
  };

  calcRobotsPos = (robots, cow) => {
    var newRoboPos = robots.map(robot => {
      var newRobot = {};
      if (robot.x === cow.x) {
        newRobot.x = robot.x;
        newRobot.y = robot.y > cow.y ? robot.y - MOVE_SIZE : robot.y + MOVE_SIZE 
      } else if (robot.y === cow.y) {
        newRobot.y = robot.y;
        newRobot.x = robot.x > cow.x ? robot.x - MOVE_SIZE : robot.x + MOVE_SIZE
      } else {
        newRobot.y = robot.y > cow.y ? robot.y - MOVE_SIZE : robot.y + MOVE_SIZE;
        newRobot.x = robot.x > cow.x ? robot.x - MOVE_SIZE : robot.x + MOVE_SIZE;
      }
      return newRobot;    
    });

    return newRoboPos;  
  };

  moveRobots = () => {
    this.setState(prevState => ({
      robots: this.calcRobotsPos(prevState.robots, prevState.cow)
    }), this.checkCollision);
  };

  checkCollision = () => {
    var { bombs, cow, robots } = this.state;
    var gameOver = false;
    var noBombRobots = robots.filter(robot => {
      return findIndex(bombs, robot) === -1;
    });

    var aliveRobots = noBombRobots.filter((robot, index, robots) => {
      return findLastIndex(robots, robot) === findIndex(robots, robot);
    });

    var newBombs = noBombRobots.filter((robot, index, robots) => {
      return findLastIndex(robots, robot) !== findIndex(robots, robot);
    });

    if (findIndex(bombs, cow) > -1 || findIndex(robots, cow) > -1) {
     gameOver = true;
    }
    
    this.setState(prevState => ({
      robots: aliveRobots,
      bombs: bombs.concat(newBombs),
      gameOver: gameOver
    }));
  };

  render() {
    const { robots, cow, bombs } = this.state;
    return (
      <div className="App" onKeyUp={this.handleKeyEvent}>
        <div className="App-header">
          <img src={cowLogo} className="App-logo" alt="logo" />
          <h2>Bad Robots</h2>
        </div>
        <p className="App-intro">
        </p>
        <Board robots={robots} cow={cow} bombs={bombs}></Board>
        <Control moveCow={this.moveCow}/>
      </div>
    );
  }
}

export default App;