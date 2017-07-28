import React, { Component } from 'react';
import robotImg from './robot.png';
import cowImg from './cow.png';
import bombImg from './bomb.png';
import cowLogo from './cow-full.png';
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
    canvas.style.backgroundColor = 'rgba(158, 167, 184, 0.2)'
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const robotImage = new Image(),
          cowImage = new Image();
    
    robotImage.src = robotImg;
    robotImage.onload = () => {
      const robots = this.props.robots;
      robots.forEach(robot=>{
        ctx.drawImage(robotImage, robot.x, robot.y);
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
    bombs: []
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
    
  };

  render() {
    const { robots, cow} = this.state;
    return (
      <div className="App" onKeyUp={this.handleKeyEvent}>
        <div className="App-header">
          <img src={cowLogo} className="App-logo" alt="logo" />
          <h2>Bad Robots</h2>
        </div>
        <p className="App-intro">
        </p>
        <Board robots={robots} cow={cow}></Board>
        <Control moveCow={this.moveCow}/>
      </div>
    );
  }
}

export default App;