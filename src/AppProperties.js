const MOVE_SIZE = 40;

const BOARD = {
  WIDTH: 1000,
  HEIGHT: 600
};

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

export default {
    MOVE_SIZE,
    MOVE,
    BOARD,
    KEYBOARD_MOVE
};