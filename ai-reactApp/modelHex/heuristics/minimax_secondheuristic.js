const minimax = require('../Minimax').minimax

function play(board, player, depth) {
  return minimax(board, player, depth, heuristica);
}


/**
 * Retorna el valor de la casilla respecto a los vecinos que tiene en su circulo más cercano.
 * @param {Number} row
 * @param {Number} col 
 * @param {Number} player Jugador que va a jugar
 * @param {Matrix} board Board HEX
 * @returns Value of field.
 */
function getValueNeighbors(row, col, player, board) {
  const OPPONENT = player === '1' ? '2' : '1';
  const moves = [[-1, 0], [0, -1], [1, -1], [1, 0], [0, 1], [-1, 1]]
  
  let result = 0;
  let nx, ny;

  for(let move in moves){
    nx = row + move[0];
    ny = col + move[1];
    
    if(checkInside(nx, ny, board.length)){
      if(board[nx][ny] === player) result++;
      else if(board[nx][ny] === OPPONENT) result--;
    }
  }

  return result;
}

function checkInside(x, y, n) {
  if (x >= 0 && x < n && y >= 0 && y < n) return true;
  return false;
}

/**
 * Retorna un array con pares (x,y) de las posiciones que ocupe el jugador 'player' en el tablero.
 * @param {int[]} board tablero 
 * @returns {int[int[2]]}
 */
 function getPlayerPos(board, player) {
  let result = [];
  let size = board.length;
  for (let k = 0; k < size; k++) {
      for (let j = 0; j < size; j++) {
          if (board[k][j] === player) {
              result.push([k, j]);
          }
      }
  }
  return result;
}

/**
 * Retorna las posiciones en donde se encuentra una ficha del player de forma aleatorea.
 * @param {*} board Hex board
 * @param {*} player Jugador que mueve.
 * @returns {int[int[2]]} posiciones en forma aleatoria.
 */
function getEmptyHexRand(board, player){
  let initValues = getPlayerPos(board, player);
  let newArray = [];
  let rand = 0;
  const initLenght = Math.min(10, initValues);
  for(let i=0; i<initLenght; i++){
    rand = parseInt(Math.random()*initValues.length);
    if(rand+1 == initValues.length) newArray.push(initValues.pop());
    else{
      newArray.push(initValues.slice(0, rand) + initValues.slice(rand+1, initValues.length));
      initValues.pop();
    }
  }

  return newArray;
}

/**
 * Calcula el valor para cada movimiento ejecutado por el jugador 'player'.
 * @param {Matrix} board 
 * @param {Char} player 
 * @returns valor total de las movidas de 'player'
 */
function heuristica(board, player){
  const fichas = getEmptyHexRand(board, player);
  let res = 0;
  
  for(let ficha in fichas){
    res += getValueNeighbors(ficha[0], ficha[1], player, board);
    res += getValueOuterNeighbors(ficha, player,board);
  }

  return res;
}

/**
 * Obtiene el valor para una ficha según los vecinos a los que pueda conectar
 * de dos formas posibles
 * @param {int[2]} ficha 
 * @param {*} player 
 * @param {*} board 
 * @returns 
 */
function getValueOuterNeighbors(ficha, player, board){
  let result = 0;
  let x = ficha[0];
  let y = ficha[1];
  let newX, newY;
  let moves = [[-1, -1], [1, -2], [2, -1], [1, 1], [-1, 2], [-2, 1]]
  let values= [[2,1,2,2,1,2], [1,2,1,1,2,1]];

  for(let i=0; i<moves.length; i++){
    newX = x + moves[i][0];
    newY = y + moves[i][1];
    
    if(checkInside(newX, newY, board.length) && board[newX][newY] === player) result += values[player === '2' ? 1: 0][i];
  }

  return result;
}

export {play}