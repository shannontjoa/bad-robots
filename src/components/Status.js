// @flow
import React from 'react';
import Theme from './Theme';

type Props = {
  status: {
    gameOver: boolean,
    level: number,
    score: number,
    safeTeleport: number,
  },
  changeTheme: string => void,
};
const Status = (props: Props) => (
  <section className="Status">
    <Theme changeTheme={props.changeTheme} />
    <div className="Status">
      {props.status.gameOver && <span className="Game-over">GAME OVER DUDE!</span>}
    </div>
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

export default Status;
