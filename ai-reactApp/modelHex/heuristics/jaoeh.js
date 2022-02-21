const minimax = require('./Minimax').minimax;

function play(board, player, depth) {
  return minimax(board, player, depth, heuristic_coneccted);
}

export {play};

function heuristic_coneccted(board, player) {
    const oponent = player === '2' ? "1" : "2";
    const ccp = countBetterConnectedV2(board, player);
    const cco = countBetterConnectedV2(board, oponent);
    return (ccp - cco) / board.length;
}

function countBetterConnectedV2(board, player) {
    var column, connected, counted, neighbors, row;
    counted = new Set();
    connected = 0;
    let maxConnected = [0];

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] === player) {
                const maxLine = getLine(board, player, i, j);
                maxConnected.push(maxLine > 0 ? maxLine + 1 : 0);
            }
        }
    }

    return Math.max(...maxConnected);
}

function getLine(board, player, x, y, connected = 0) {
    let neighbors = getRelevantNeighbors(board, player, x, y);
    let paths = [connected]

    for (const [r, c] of neighbors) {
        if (board[r][c] === player) {
            paths.push(getLine(board, player, r, c, connected + 1));
        }
    }

    return Math.max(...paths);
}

function getRelevantNeighbors(board, player, x, y) {
    var neighborhood, nx, ny, relevantNeighborhood2, relevantNeighborhood1;
    relevantNeighborhood1 = [[-1, 1], [0, 1]];
    relevantNeighborhood2 = [[1, -1], [1, 0]];
    neighborhood = [];

    if (player === '1') {
        neighborhood = relevantNeighborhood1;
    } else {
        neighborhood = relevantNeighborhood2;
    }

    let cola = [];

    for (let i = 0; i < neighborhood.length; i++) {
        nx = x + neighborhood[i][0];
        ny = y + neighborhood[i][1];

        if (checkInside(nx, ny, board.length)) {
            cola.push([nx, ny]);
        }
    }

    return cola;
}

function checkInside(x, y, n) {
    if (x >= 0 && x < n && y >= 0 && y < n) return true;
    return false;
}