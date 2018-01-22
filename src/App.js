import React from 'react';
import { findIndex, findLastIndex } from 'lodash';
import cowLogo from './media/cow-full.png';
import Board from './containers/Board';
import Control from './containers/Control';
import Status from './components/Status';
import AppProperties from './AppProperties';
import './App.css';

const { MOVE, MOVE_SIZE, BOARD } = AppProperties;

const getRandomInt = (a, b) => {
  const min = Math.ceil(a);
  const max = Math.floor(b);
  return Math.floor(Math.random() * (max - min)) + min;
};
const getRandomPos = (min, max) => getRandomInt(min, max) * MOVE_SIZE;

const getNewPos = () => ({
  x: getRandomPos(0, BOARD.WIDTH / 40),
  y: getRandomPos(0, BOARD.HEIGHT / 40),
});

const genRoboPos = (level) => {
  const incrementBy = 5;
  let robots = new Array(level * incrementBy);
  robots.fill(null);
  robots = robots.map(() => getNewPos());

  return robots;
};

const getSafeNewPos = (robots, bombs) => {
  let maxTry = 10000;
  let newPos;

  while (maxTry !== 0) {
    maxTry -= 1;
    newPos = getNewPos();
    if (findIndex(robots, newPos) === -1 && findIndex(bombs, newPos) === -1) {
      return newPos;
    }
  }
};

const catchMeIfYouCan = (() => {
  let instance;

  const init = () => {
    let setIntervalRef = 0;
    const interval = 250;
    const startInterval = (callback) => {
      setIntervalRef = setInterval(callback, interval);
    };
    const stopInterval = () => {
      clearInterval(setIntervalRef);
      setIntervalRef = 0;
    };
    const service = {
      start: startInterval,
      stop: stopInterval,
      isTrue: () => setIntervalRef !== 0,
    };

    return service;
  };

  return {
    getInstance: () => {
      if (!instance) {
        instance = init();
      }
      return instance;
    },
  };
})();

const calcRobotsPos = (robots, cow) =>
  robots.map((robot) => {
    const newRobot = {};
    if (robot.x === cow.x) {
      newRobot.x = robot.x;
      newRobot.y = robot.y > cow.y ? robot.y - MOVE_SIZE : robot.y + MOVE_SIZE;
    } else if (robot.y === cow.y) {
      newRobot.y = robot.y;
      newRobot.x = robot.x > cow.x ? robot.x - MOVE_SIZE : robot.x + MOVE_SIZE;
    } else {
      newRobot.y = robot.y > cow.y ? robot.y - MOVE_SIZE : robot.y + MOVE_SIZE;
      newRobot.x = robot.x > cow.x ? robot.x - MOVE_SIZE : robot.x + MOVE_SIZE;
    }
    return newRobot;
  });

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      robots: genRoboPos(1),
      cow: getNewPos(),
      bombs: [],
      status: {
        level: 1,
        score: 0,
        gameOver: false,
        safeTeleport: 0,
        theme: 'default',
      },
    };
    this.calcCowPos = this.calcCowPos.bind(this);
    this.moveCow = this.moveCow.bind(this);
    this.moveRobots = this.moveRobots.bind(this);
    this.initNewGame = this.initNewGame.bind(this);
    this.checkBoardStatus = this.checkBoardStatus.bind(this);
    this.checkCollision = this.checkCollision.bind(this);
    this.changeTheme = this.changeTheme.bind(this);
  }

  calcCowPos(cow, dir) {
    if (dir === MOVE.TELEPORT) {
      return getNewPos();
    }
    if (dir === MOVE.S_TELEPORT) {
      return getSafeNewPos(this.state.robots, this.state.bombs);
    }

    const newCow = {};
    newCow[MOVE.UP] = {
      x: cow.x,
      y: cow.y - MOVE_SIZE < 0 ? cow.y : cow.y - MOVE_SIZE,
    };
    newCow[MOVE.DOWN] = {
      x: cow.x,
      y: cow.y + MOVE_SIZE < BOARD.HEIGHT ? cow.y + MOVE_SIZE : cow.y,
    };
    newCow[MOVE.RIGHT] = {
      x: cow.x + MOVE_SIZE < BOARD.WIDTH ? cow.x + MOVE_SIZE : cow.x,
      y: cow.y,
    };
    newCow[MOVE.LEFT] = {
      x: cow.x - MOVE_SIZE < 0 ? cow.x : cow.x - MOVE_SIZE,
      y: cow.y,
    };
    newCow[MOVE.UP_LEFT] = {
      x: cow.x - MOVE_SIZE < 0 ? cow.x : cow.x - MOVE_SIZE,
      y: cow.y - MOVE_SIZE < 0 ? cow.y : cow.y - MOVE_SIZE,
    };
    newCow[MOVE.UP_RIGHT] = {
      x: cow.x + MOVE_SIZE < BOARD.WIDTH ? cow.x + MOVE_SIZE : cow.x,
      y: cow.y - MOVE_SIZE < 0 ? cow.y : cow.y - MOVE_SIZE,
    };
    newCow[MOVE.DOWN_LEFT] = {
      x: cow.x - MOVE_SIZE < 0 ? cow.x : cow.x - MOVE_SIZE,
      y: cow.y + MOVE_SIZE < BOARD.HEIGHT ? cow.y + MOVE_SIZE : cow.y,
    };
    newCow[MOVE.DOWN_RIGHT] = {
      x: cow.x + MOVE_SIZE < BOARD.WIDTH ? cow.x + MOVE_SIZE : cow.x,
      y: cow.y + MOVE_SIZE < BOARD.HEIGHT ? cow.y + MOVE_SIZE : cow.y,
    };
    newCow[MOVE.CATCH_ME] = cow;

    return newCow[dir];
  }

  moveCow(dir) {
    if (dir === MOVE.CATCH_ME) {
      catchMeIfYouCan.getInstance().start(this.moveRobots);
    }
    const moveRobots = () => (dir !== MOVE.S_TELEPORT ? this.moveRobots() : null);
    this.setState(
      prevState => ({
        cow: this.calcCowPos(this.state.cow, dir),
        status: {
          ...prevState.status,
          safeTeleport:
            dir === MOVE.S_TELEPORT
              ? prevState.status.safeTeleport - 1
              : prevState.status.safeTeleport,
        },
      }),
      moveRobots,
    );
  }

  moveRobots() {
    const { cow, robots } = this.state;
    // Before moving robots, check if cow hit robots.
    if (findIndex(robots, cow) > -1) {
      this.setState(prevState => ({
        status: {
          ...prevState.status,
          gameOver: true,
        },
      }));
    } else {
      // Otherwise, move robots
      this.setState(
        prevState => ({
          robots: calcRobotsPos(prevState.robots, prevState.cow),
        }),
        this.checkCollision,
      );
    }
  }

  initNewGame() {
    catchMeIfYouCan.getInstance().stop();
    this.setState(prevState => ({
      robots: genRoboPos(1),
      cow: getNewPos(),
      bombs: [],
      status: {
        level: 1,
        score: 0,
        gameOver: false,
        safeTeleport: 0,
        theme: prevState.status.theme,
      },
    }));
  }

  checkBoardStatus() {
    const catchMe = catchMeIfYouCan.getInstance();
    if (this.state.status.gameOver && catchMe.isTrue()) {
      catchMe.stop();
    }
    if (this.state.robots.length === 0) {
      let { safeTeleport } = this.state.status;
      if (catchMe.isTrue()) {
        catchMe.stop();
        safeTeleport = (+safeTeleport || 0) + 1;
      }

      this.setState(prevState => ({
        robots: genRoboPos(prevState.status.level + 1),
        cow: getNewPos(),
        bombs: [],
        status: {
          ...prevState.status,
          level: prevState.status.level + 1,
          gameOver: false,
          safeTeleport,
        },
      }));
    }
  }
  checkCollision() {
    const { bombs, cow, robots } = this.state;
    let score = 0;
    // Find robots that weren't bombed.
    const bombSurvivors = robots.filter(robot => findIndex(bombs, robot) === -1);

    // Check collision with one another
    const aliveRobots = bombSurvivors.filter((robot, index, bots) => findLastIndex(bots, robot) === findIndex(bots, robot));

    const newBombs = bombSurvivors.filter((robot, index, bots) => findLastIndex(bots, robot) !== findIndex(bots, robot));

    score = (robots.length - bombSurvivors.length) * 2;
    score += newBombs.length * 2;

    this.setState(
      prevState => ({
        robots: aliveRobots,
        bombs: [...prevState.bombs, ...newBombs],
        status: {
          ...prevState.status,
          score: prevState.status.score + score,
          gameOver: findIndex(bombs, cow) > -1 || findIndex(robots, cow) > -1,
        },
      }),
      this.checkBoardStatus,
    );
  }

  changeTheme(theme) {
    this.setState(prevState => ({
      status: {
        ...prevState.status,
        theme,
      },
    }));
  }

  render() {
    const {
      robots, cow, bombs, status,
    } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={cowLogo} className="App-logo" alt="logo" />
          <h2>Bad Robots</h2>
        </header>
        <p className="App-intro" />
        <div className="Game">
          <Status status={status} changeTheme={this.changeTheme} />
          <Board robots={robots} cow={cow} bombs={bombs} moveCow={this.moveCow} status={status} />
          <Control moveCow={this.moveCow} initNewGame={this.initNewGame} status={status} />
        </div>
        <footer />
      </div>
    );
  }
}

export default App;
