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
      <section>
        <canvas id="board" width={BOARD.WIDTH} height={BOARD.HEIGHT}>No Canvas available in your browser</canvas>
      </section>
    );
  };  
}

const Status = (props) => {
  const displayGameOver = () => {
    if (props.status.gameOver) {
      return (<span>GAME OVER</span>);
    }
  }
  return (
    <section className="Status">
      <div>{ displayGameOver() }</div>
      <div>&nbsp;</div>
      <div className="Level">
        <div>Level</div>
        <div>{props.status.level}</div>
      </div>
      <div>&nbsp;</div>
      <div className="Score">
        <div className="Score">Score</div>
        <div>{props.status.score}</div>
      </div>  
    </section>
  );
};

class Control extends Component {
  handleMoveClick = (event) => {
    this.props.moveCow(event.currentTarget.value);
  };

  handleNewGameClick = (event) => {
    this.props.initNewGame();
  };

  render() {
    return (
      <section className='Control'>
        <div>
          <button onClick={this.handleNewGameClick}>New Game</button>
        </div>
        <div>&nbsp;</div>
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
  var incrementBy = 5, robots = new Array(level*incrementBy);
  robots.fill(null);
  robots = robots.map((robot => {
    return getNewPos();
  }));

  return robots;  
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min 
};

const getRandomPos = (min, max) => {
  return getRandomInt(min, max) * MOVE_SIZE;
};

const getNewPos = () => {
  return {
      x: getRandomPos(0, BOARD.WIDTH/40),
      y: getRandomPos(0, BOARD.HEIGHT/40)
  };
};
class App extends Component {
  state = {
    robots: genRoboPos(1),
    cow: getNewPos(),
    bombs: [],
    status: { level: 1, score: 0, gameOver: false }
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
    newCow[MOVE.TELEPORT]   = getNewPos()

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

  initNewGame = () => {
      this.setState(prevState => ({
        robots: genRoboPos(1),
        cow: getNewPos(),
        bombs: [],
        status: { level: 1, score: 0, gameOver: false }
      }));
  };

  checkBoardStatus = () => {
    if (this.state.robots.length === 0) {
      this.setState(prevState => ({
        robots: genRoboPos(prevState.status.level + 1),
        cow: getNewPos(),
        bombs: [],
        status: { level: prevState.status.level + 1, score: prevState.status.score, gameOver: false }
      }));
    }
  };
  checkCollision = () => {
    var { bombs, cow, robots } = this.state;
    var noBombRobots = robots.filter(robot => {
      return findIndex(bombs, robot) === -1;
    });

    var aliveRobots = noBombRobots.filter((robot, index, robots) => {
      return findLastIndex(robots, robot) === findIndex(robots, robot);
    });

    var newBombs = noBombRobots.filter((robot, index, robots) => {
      return findLastIndex(robots, robot) !== findIndex(robots, robot);
    });

    this.setState(prevState => ({
      robots: aliveRobots,
      bombs: bombs.concat(newBombs),
      status: {
        level: prevState.status.level,
        score: prevState.status.score,
        gameOver: findIndex(bombs, cow) > -1 || findIndex(robots, cow) > -1
      }
    }), this.checkBoardStatus);
  };

  render() {
    const { robots, cow, bombs, status } = this.state;
    return (
      <div className="App" onKeyUp={this.handleKeyEvent}>
        <header className="App-header">
          <img src={cowLogo} className="App-logo" alt="logo" />
          <h2>Bad Robots</h2>
        </header>
        <p className="App-intro">
        </p>
        <div className="Game">
          <Status status={status}></Status>
          <Board robots={robots} cow={cow} bombs={bombs}></Board>
          <Control moveCow={this.moveCow} initNewGame={this.initNewGame}/>
        </div>
        <footer></footer>
      </div>
    );
  }
}

export default App;