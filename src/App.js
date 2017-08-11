import React, { Component } from 'react';
import robotImg from './media/robot.png';
import cowImg from './media/cow.png';
import bombImg from './media/bomb.png';
import cowLogo from './media/cow-full.png';
import appleImg from './media/apple.png';
import droidImg from './media/droid.png';
import bananaImg from './media/banana.png';
import burgerImg from './media/burger.png';
import goodPokeImg from './media/pikachu.png';
import badPokeImg from './media/jigglypuff.png';
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
    TELEPORT:   'TELEPORT',
    S_TELEPORT: 'S_TELEPORT',
    CATCH_ME:   'CATCH_ME'
};

const KEYBOARD_MOVE = {
    k: MOVE.UP,
    j: MOVE.DOWN,
    h: MOVE.LEFT,
    l: MOVE.RIGHT,
    y: MOVE.UP_LEFT,
    u: MOVE.UP_RIGHT,
    b: MOVE.DOWN_LEFT,
    n: MOVE.DOWN_RIGHT,
    t: MOVE.TELEPORT,
    s: MOVE.S_TELEPORT,
    c: MOVE.CATCH_ME
};

const MOVE_SIZE = 40;
const BOARD = {
  WIDTH: 1000,
  HEIGHT: 600
};

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

const Theme = (props) => {
  const handleThemeChange = (event) => {
    props.changeTheme(event.currentTarget.value);
  }
  return (
    <section className="Status">
    <div>
      <label>Theme</label>
    </div>
      <select name="theme" onChange={handleThemeChange}>
        <option value="default">Default</option>
        <option value="mobile">Mobile OS</option>
        <option value="food">Food</option>
        <option value="pokemon">Pokemon</option>
      </select>
    </section>
  );
};

const Status = (props) => {
  const displayGameOver = () => {
    if (props.status.gameOver) {
      return (<span className="Game-over">GAME OVER</span>);
    }
  }
  return (
    <section className="Status">
      <Theme changeTheme={props.changeTheme}></Theme>
      <div className="Status">{ displayGameOver() }</div>
      <div className="Status">
        <div>Level</div>
        <div>{props.status.level}</div>
      </div>
      <div className="Status">
        <div>Score</div>
        <div>{props.status.score}</div>
      </div>
      <div className="Status">
        <div>Safe Teleport</div>
        <div>{props.status.safeTeleport}</div>
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

  getSafeTelBtnStatus = () => {
    return (this.getNavBtnStatus() && this.props.status.safeTeleport) === 0 ? 'disabled' : '';
  }

  getNavBtnStatus = () => {
    return this.props.status.gameOver ? 'disabled' : '';
  }

  render() {
    return (
      <section className='Control'>
        <div>
          <button className="newGame" onClick={this.handleNewGameClick}>New Game</button>
        </div>
        <div>
          <button disabled={this.getNavBtnStatus()} value={MOVE.UP_LEFT} onClick={this.handleMoveClick}>Up+Left</button>
          <button disabled={this.getNavBtnStatus()} value={MOVE.UP} onClick={this.handleMoveClick}>Up</button>
          <button disabled={this.getNavBtnStatus()} value={MOVE.UP_RIGHT} onClick={this.handleMoveClick}>Up+Right</button>
        </div>
        <button disabled={this.getNavBtnStatus()} value={MOVE.LEFT} onClick={this.handleMoveClick}>Left</button>
        <button disabled={this.getNavBtnStatus()} value={MOVE.RIGHT} onClick={this.handleMoveClick}>Right
        </button>
        <div>
          <button disabled={this.getNavBtnStatus()} value={MOVE.DOWN_LEFT} onClick={this.handleMoveClick}>Down+Left</button>          
          <button disabled={this.getNavBtnStatus()} value={MOVE.DOWN} onClick={this.handleMoveClick}>Down</button>
          <button disabled={this.getNavBtnStatus()} value={MOVE.DOWN_RIGHT} onClick={this.handleMoveClick}>Down+Right</button>
        </div>
        <div>
          <button className="teleport" disabled={this.getNavBtnStatus()} value={MOVE.TELEPORT} onClick={this.handleMoveClick}>Teleport</button>
        </div>
        <div>
          <button className="safeTeleport" disabled={this.getSafeTelBtnStatus()} value={MOVE.S_TELEPORT} onClick={this.handleMoveClick}>Safe Teleport</button>
        </div>
        <div>
          <button className="catchMe" disabled={this.getNavBtnStatus()} value={MOVE.CATCH_ME} onClick={this.handleMoveClick}>Catch Me If You Can</button>
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