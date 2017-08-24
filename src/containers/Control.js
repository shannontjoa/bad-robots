import React, { Component } from 'react';
import AppProperties from '../AppProperties';

const MOVE = AppProperties.MOVE;
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

  export default Control;