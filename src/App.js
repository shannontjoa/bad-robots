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
      const roboPos = this.props.roboPos;
      roboPos.forEach(pos=>{
        ctx.drawImage(robotImage, pos.x, pos.y);
      });
    };

    cowImage.src = cowImg;
    cowImage.onload = () => {
      const cowPos = this.props.cowPos;
      ctx.drawImage(cowImage, cowPos.x, cowPos.y)
    };
  };

  render() {
    return (
      <canvas id="board" width="1000" height="605">Your browser doesn't support HTML5 Canvas</canvas>
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
    { x: 400, y: 40 }, { x:40, y:200 }, { x:400, y:320 }, { x:400, y:240 }
  ]);  
};

class App extends Component {
  state = {
    roboPos: genRoboPos(1),
    cowPos: { x:400, y:200 }
  }

  calcCowPos = (cowPos, dir) => {
    const newPos = {};
    newPos[MOVE.UP]         = { x: cowPos.x, y: cowPos.y-MOVE_SIZE };
    newPos[MOVE.DOWN]       = { x: cowPos.x, y: cowPos.y+MOVE_SIZE };
    newPos[MOVE.RIGHT]      = { x: cowPos.x+MOVE_SIZE, y: cowPos.y };
    newPos[MOVE.LEFT]       = { x: cowPos.x-MOVE_SIZE, y: cowPos.y };
    newPos[MOVE.UP_LEFT]    = { x: cowPos.x-MOVE_SIZE, y: cowPos.y-MOVE_SIZE };
    newPos[MOVE.UP_RIGHT]   = { x: cowPos.x+MOVE_SIZE, y: cowPos.y-MOVE_SIZE };
    newPos[MOVE.DOWN_LEFT]  = { x: cowPos.x-MOVE_SIZE, y: cowPos.y+MOVE_SIZE };
    newPos[MOVE.DOWN_RIGHT] = { x: cowPos.x+MOVE_SIZE, y: cowPos.y+MOVE_SIZE };

    return newPos[dir];
  };

  moveCow = (dir) => {
    const newCowPos = this.calcCowPos(this.state.cowPos, dir);
    this.setState(prevState => ({
      cowPos: newCowPos
    }), this.moveRobots);
  };

  calcRobotsPos = (roboPos, cow) => {
    var newRoboPos = roboPos.map(robo => {
      var newRobo = {};
      if (robo.x === cow.x) {
        newRobo.x = robo.x;
        newRobo.y = robo.y > cow.y ? robo.y - MOVE_SIZE : robo.y + MOVE_SIZE 
      } else if (robo.y === cow.y) {
        newRobo.y = robo.y;
        newRobo.x = robo.x > cow.x ? robo.x - MOVE_SIZE : robo.x + MOVE_SIZE
      } else {
        return robo;
      }
      return newRobo;    
    });

    return newRoboPos;  
  };

  moveRobots = () => {
    // this.setState(prevState => ({
    //   roboPos: this.calcRobotsPos(prevState.roboPos, prevState.cowPos)
    // }));
  };

  render() {
    const { roboPos, cowPos} = this.state;
    return (
      <div className="App" onKeyUp={this.handleKeyEvent}>
        <div className="App-header">
          <img src={cowLogo} className="App-logo" alt="logo" />
          <h2>Bad Robots</h2>
        </div>
        <p className="App-intro">
        </p>
        <Board roboPos={roboPos} cowPos={cowPos}></Board>
        <Control moveCow={this.moveCow}/>
      </div>
    );
  }
}

export default App;