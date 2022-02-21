const goalTest = require("./goalTest");


const oo = 1e7;
// best -> x,y
function minimax(board, player, depth, h) {
  var best, value;
  [best, value] = maxplay(board, null, player, depth, h);
  return best;
}

module.exports = { minimax };


/**
 * Maximiza el valor de player.
 * @param {array[char]} board Tablero HEX
 * @param {[x,y]} play posición de la jugada que se realiza.
 * @param {char} player Jugador que juega¿? 
 * @param {int} depth Profundidad del arbol de busqueda.
 * @param {function} h Heuristica
 * @param {int} alpha Alpha para poda
 * @param {int} beta Beta para poda.
 * @returns {[[int,int], int]} posición de la jugada optima y calculado por el minimax al calcularla. 
 */
function maxplay(board, play, player, depth, h, alpha = -Infinity, beta = Infinity) {
  let best = null;
  let best_value = -Infinity;

  if (goalTest(board)){
      return [play, -oo]; // 1 if game.winner() == player else -1
  }

  if (!depth){//Revisa si ya se llegó a la profundidad de busqueda maxima del minimax y retornarna la jugada más el valor respectivo de la heuristica.
      return [play, h(board, player)];
  }


  const emptySlots = getEmptyHex(board);
  for (const move of emptySlots) {
      const [b, value] = minplay(getNewMove(board, move, player == '1' ? '1':'2'), move,  player, depth - 1, h); //Llama el componente minimizador.
      alpha = Math.max(alpha, value);

      if (alpha >= beta)
          break;

      if (value > best_value) {
          best = move;
          best_value = value;
      }
  }

  return [best, best_value];
}

function minplay(board, play, player, depth, h, alpha = -Infinity, beta = Infinity) {
  let best = null;
  let best_value = Infinity;

  if (goalTest(board)){
    
    return [play, oo];
  }

  if (!depth) 
      return [play, h(board, player)];

  const emptySlots = getEmptyHex(board);
  for (const move of emptySlots) {
      const [a, value] = maxplay(getNewMove(board, move, player == '1' ? '2':'1'), move,  player, depth - 1, h);
      beta = Math.min(beta, value);

      if (beta <= alpha)
          break;

      if (value < best_value) {
          best = move;
          best_value = value;
      }
  }

  return [best, best_value];
}

/**
 * Retorna un array con pares (x,y) de las posiciones disponibles en el tablero.
 * @param {int[]} board tablero 
 * @returns {int[int[2]]}
 */
function getEmptyHex(board) {
  let result = [];
  let size = board.length;
  for (let k = 0; k < size; k++) {
      for (let j = 0; j < size; j++) {
          if (board[k][j] === 0) {
              result.push([k, j]);
          }
      }
  }
  return result;
}



function getNewMove(board, move, player) {
  let auxBoard = JSON.parse(JSON.stringify(board));
  const [x, y] = move;
  auxBoard[x][y] = player;
  return auxBoard;
}