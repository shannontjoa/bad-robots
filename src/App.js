import React, { Component } from 'react';
import { findIndex, findLastIndex } from 'lodash';
import cowLogo from './media/cow-full.png';
import Board from './containers/Board';
import Control from './containers/Control';
import Status from './components/Status';
import AppProperties from './AppProperties';
import './App.css';

const { MOVE, MOVE_SIZE, BOARD } = AppProperties;

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
  console.log('calling getNewPos');
  return {
      x: getRandomPos(0, BOARD.WIDTH/40),
      y: getRandomPos(0, BOARD.HEIGHT/40)
  };
};

const getSafeNewPos = (robots, bombs) => {
  var maxTry = 10000,
      newPos;

  while (maxTry !== 0) {
    maxTry--;
    newPos = getNewPos();
    if (findIndex(robots, newPos) === -1 && findIndex(bombs, newPos) === -1) {
      return newPos;
    }
  }
};

class App extends Component {
  state = {
    robots: genRoboPos(1),
    cow: getNewPos(),
    bombs: [],
    status: { level: 1, score: 0, gameOver: false, safeTeleport: 0, theme: 'default' }
  }

  calcCowPos = (cow, dir) => {
    if (dir === MOVE.TELEPORT) { return getNewPos(); }
    if (dir === MOVE.S_TELEPORT) { return getSafeNewPos(this.state.robots, this.state.bombs); }
    
    let newCow = {};
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
    newCow[MOVE.CATCH_ME]   = cow;

    return newCow[dir];
  };

  moveCow = (dir) => {
    if (dir === MOVE.CATCH_ME) {
      catchMeIfYouCan.getInstance().start(this.moveRobots);
    }
    const newCowPos = this.calcCowPos(this.state.cow, dir);
    const moveRobots = () => {
      return dir !== MOVE.S_TELEPORT ? this.moveRobots() : null; 
    };
    this.setState(prevState => ({
      cow: newCowPos,
      status: {
        level: prevState.status.level,
        score: prevState.status.score,
        gameOver: prevState.status.gameOver,
        safeTeleport: dir === MOVE.S_TELEPORT ? prevState.status.safeTeleport-1 : prevState.status.safeTeleport,
        theme: prevState.status.theme
      }
    }), moveRobots);
  };

  calcRobotsPos = (robots, cow) => {
    var robotsPos = robots.map(robot => {
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

    return robotsPos;  
  };

  moveRobots = () => {
    var { cow, robots } = this.state;
    // Before moving robots, check if cow hit robots.
    if (findIndex(robots, cow) > -1) {
      this.setState(prevState => ({
        status: {
           level: prevState.status.level,
           score: prevState.status.score,
           gameOver: true,
           safeTeleport: prevState.status.safeTeleport,
           theme: prevState.status.theme
         }
      }));
    }
    // Otherwise, move robots
    else {
      this.setState(prevState => ({
        robots: this.calcRobotsPos(prevState.robots, prevState.cow)
      }), this.checkCollision);
    }
  };

  initNewGame = () => {
    catchMeIfYouCan.getInstance().stop();
    this.setState(prevState => ({
      robots: genRoboPos(1),
      cow: getNewPos(),
      bombs: [],
      status: { 
        level: 1, score: 0, gameOver: false, safeTeleport: 0,
        theme: prevState.status.theme 
      }
    }));
  };

  checkBoardStatus = () => {
    var catchMe = catchMeIfYouCan.getInstance();
    if (this.state.status.gameOver && catchMe.isTrue()) {
      catchMe.stop();
    }
    if (this.state.robots.length === 0) {
      let safeTeleport = this.state.status.safeTeleport;
      if (catchMe.isTrue()) {
        catchMe.stop();
        safeTeleport = (+safeTeleport || 0) + 1;
      }

      this.setState(prevState => ({
        robots: genRoboPos(prevState.status.level + 1),
        cow: getNewPos(),
        bombs: [],
        status: {
          level: prevState.status.level + 1,
          score: prevState.status.score,
          gameOver: false,
          safeTeleport: safeTeleport,
        theme: prevState.status.theme
        }
      }));
    }
  };
  checkCollision = () => {
    var { bombs, cow, robots } = this.state;
    var score = 0;
    // Find robots that weren't bombed.
    var bombSurvivors = robots.filter(robot => {
      return findIndex(bombs, robot) === -1;
    });

    // Check collision with one another
    var aliveRobots = bombSurvivors.filter((robot, index, robots) => {
      return findLastIndex(robots, robot) === findIndex(robots, robot);
    });

    var newBombs = bombSurvivors.filter((robot, index, robots) => {
      return findLastIndex(robots, robot) !== findIndex(robots, robot);
    });

    score = (robots.length - bombSurvivors.length) * 2;
    score += newBombs.length * 2;

    this.setState(prevState => ({
      robots: aliveRobots,
      bombs: bombs.concat(newBombs),
      status: {
        level: prevState.status.level,
        score: prevState.status.score + score,
        gameOver: findIndex(bombs, cow) > -1 || findIndex(robots, cow) > -1,
        safeTeleport: prevState.status.safeTeleport,
        theme: prevState.status.theme
      }
    }), this.checkBoardStatus);
  };

  changeTheme = (theme) => {
    this.setState(prevState => ({
      status: {
        level: prevState.status.level,
        score: prevState.status.score,
        gameOver: prevState.status.gameOver,
        safeTeleport: prevState.status.safeTeleport,
        theme: theme
      }
    }));
  };

  render() {
    const { robots, cow, bombs, status } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={cowLogo} className="App-logo" alt="logo" />
          <h2>Bad Robots</h2>
        </header>
        <p className="App-intro">
        </p>
        <div className="Game">
          <Status status={status} changeTheme={this.changeTheme}></Status>
          <Board robots={robots} cow={cow} bombs={bombs} moveCow={this.moveCow} status={status}></Board>
          <Control moveCow={this.moveCow} initNewGame={this.initNewGame} status={status} />
        </div>
        <footer></footer>
      </div>
    );
  }
}

var catchMeIfYouCan = (() => {
  var instance;

  var init = () => {
    var setIntervalRef = 0;
    const interval = 250;
    var startInterval = (callback) => {
      setIntervalRef = setInterval(callback, interval);
    };
    var stopInterval = () => {
      clearInterval(setIntervalRef);
      setIntervalRef = 0;
    };
    var service = {
      start: startInterval,
      stop: stopInterval,
      isTrue: () => { return setIntervalRef !== 0; }
    };

    return service;
  }

  return {
    getInstance: () => {
      if (!instance) {
        instance = init();
      }
      return instance;
    }
  } ;
}
)();

export default App;