import React from 'react';
import Theme from './Theme'

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

  export default Status;