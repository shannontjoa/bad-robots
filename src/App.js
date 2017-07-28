import React, { Component } from 'react';
import robotImg from './robot.png';
import cowImg from './cow.png';
import cowLogo from './cow-full.png';
import './App.css';

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
          <button value='UP' onClick={this.handleMoveClick}>Up</button>
        </div>
        <button value='LEFT' onClick={this.handleMoveClick}>Left</button><span>&emsp;&emsp;&emsp;</span><button value='RIGHT' onClick={this.handleMoveClick}>Right</button>
        <div><button value='DOWN' onClick={this.handleMoveClick}>Down</button></div>
        <div>
          <button value='TELEPORT' onClick={this.handleMoveClick}>Teleport</button>
        </div>
      </section>
    );
  }
};

const genRoboPos = (level) => {
  return ([
    {x: 100, y: 20}, {x:50, y:349}, {x:500, y:246}, {x:600, y:300}
  ]);  
};

class App extends Component {
  state = {
    roboPos: genRoboPos(1),
    cowPos: {x:350, y:200}
  }

  moveCow = (dir) => {
    switch(dir) {
      case 'UP':
        this.setState(prevState => ({
          cowPos: {
            x: prevState.cowPos.x,
            y: prevState.cowPos.y-10
          },
          roboPos: this.moveRobo(prevState.roboPos, dir)
        }));
        break;
      case 'DOWN':
        this.setState(prevState => ({
          cowPos: {
            x: prevState.cowPos.x,
            y: prevState.cowPos.y+10
          } ,
          roboPos: this.moveRobo(prevState.roboPos, dir)
        }));
        break;
      case 'RIGHT':
        this.setState(prevState => ({
          cowPos: {
            x: prevState.cowPos.x+10,
            y: prevState.cowPos.y
          }  ,
          roboPos: this.moveRobo(prevState.roboPos, dir)
        }));
        break;
      case 'LEFT':
        this.setState(prevState => ({
          cowPos: {
            x: prevState.cowPos.x-10,
            y: prevState.cowPos.y
          },
          roboPos: this.moveRobo(prevState.roboPos, dir)
        }));
        break;  
      default:    
    }
  };

  moveRobo = (robos, dir) => {
    return ([
      {x: 100, y: 20}, {x:50, y:349}, {x:500, y:246}, {x:300, y:300}
    ]);  
  }

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