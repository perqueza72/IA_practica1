const Agent = require('ai-agents').Agent;
// import { play } from "./jaoeh";
import { play } from "./heuristics/minimax_secondheuristic";

class HexAgent extends Agent {
    constructor(value) {
        super(value);
    }

    /**
     * return a new move. The move is an array of two integers, representing the
     * row and column number of the hex to play. If the given movement is not valid,
     * the Hex controller will perform a random valid movement for the player
     * Example: [1, 1]
     */
    send() {
        let board = this.perception;
        let size = board.length;
        let available = getEmptyHex(board);
        let nTurn = size * size - available.length;
        // console.log(board);

        if (nTurn == 0) { // First move
            return [Math.floor(size / 2), Math.floor(size / 2) - 1];
        } else if (nTurn == 1) {
            return [Math.floor(size / 2), Math.floor(size / 2)];
        } else {
            let player = (nTurn % 2 == 0) ? '1' : '2';
            let move = play(board, player, 4);
            return move;
        }
    }

}

module.exports = HexAgent;

/**
 * Return an array containing the id of the empty hex in the board
 * id = row * size + col;
 * @param {Matrix} board 
 */
function getEmptyHex(board) {
    let result = [];
    let size = board.length;
    for (let k = 0; k < size; k++) {
        for (let j = 0; j < size; j++) {
            if (board[k][j] === 0) {
                result.push(k * size + j);
            }
        }
    }
    return result;
}
