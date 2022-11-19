let adjustBoard = (p1Board, p2Board, who, changed, roll) => {
    let newP1Board = p1Board;
    let newP2Board = p2Board;

    if (who == 1) { // p1 attacks p2's board
        for (let i = changed % 3; i < 9; i += 3) {
            if (newP2Board[i] == roll) {
                newP2Board[i] = null;
            }
        }
    }

    if (who == 2) { // p2 attacks p1's board
        for (let i = changed % 3; i < 9; i += 3) {
            if (newP1Board[i] == roll) {
                newP1Board[i] = null;
            }
        }
    }

    for (let i = 0; i < 2; i++) { // Push values to the top of p1's board
        for (let j = 0; j < 6; j++) {
          if (newP1Board[j] == null && newP1Board[j + 3] != null) {
              newP1Board[j] = newP1Board[j + 3];
              newP1Board[j + 3] = null;
          }
        }
      }
    
      for (let i = 0; i < 2; i++) { // Push values to the top of p2's board
        for (let j = 0; j < 6; j++) {
          if (newP2Board[j] == null && newP2Board[j + 3] != null) {
              newP2Board[j] = newP2Board[j + 3];
              newP2Board[j + 3] = null;
          }
        }
      }

    return [newP1Board, newP2Board];
}

let calculateScore = (p1Board, p2Board) => {
    let p1Score = 0;
    let p2Score = 0;

    let p1Col;
    for (let i = 0; i < 3; i++) {
        p1Col = [p1Board[i], p1Board[i + 3], p1Board[i + 6]];
        if (p1Col[0] == p1Col[1] && p1Col[1] == p1Col[2]) { // Everything is the same
        p1Score += p1Col[0] * 9;
        }
        else if (p1Col[0] == p1Col[1]) { // First 2 are same
        p1Score += p1Col[0] * 4;
        p1Score += p1Col[2];
        }
        else if (p1Col[0] == p1Col[2]) { // First and last are same
        p1Score += p1Col[0] * 4;
        p1Score += p1Col[1];
        }
        else if (p1Col[1] == p1Col[2]) { // Second and last are same
        p1Score += p1Col[1] * 4;
        p1Score += p1Col[0];
        }
        else { // None are same
        p1Score += p1Col[0] + p1Col[1] + p1Col[2]
        }
    }

    let p2Col;
    for (let i = 0; i < 3; i++) {
        p2Col = [p2Board[i], p2Board[i + 3], p2Board[i + 6]];
        if (p2Col[0] == p2Col[1] && p2Col[1] == p2Col[2]) { // Everything is the same
        p2Score += p2Col[0] * 9;
        }
        else if (p2Col[0] == p2Col[1]) { // First 2 are same
        p2Score += p2Col[0] * 4;
        p2Score += p2Col[2];
        }
        else if (p2Col[0] == p2Col[2]) { // First and last are same
        p2Score += p2Col[0] * 4;
        p2Score += p2Col[1];
        }
        else if (p2Col[1] == p2Col[2]) { // Second and last are same
        p2Score += p2Col[1] * 4;
        p2Score += p2Col[0];
        }
        else { // None are same
        p2Score += p2Col[0] + p2Col[1] + p2Col[2]
        }
    }

    return [p1Score, p2Score];
}

let checkWinner = (p1Board, p2Board) => {
    let hasWon = true;
    // If either board is full, the game is over
    for (let i = 0; i < 9; i++) {
        if (p1Board[i] == null) hasWon = false;
    }
    if (hasWon) return true;
    hasWon = true;
    for (let i = 0; i < 9; i++) {
        if (p2Board[i] == null) hasWon = false;
    }
    if (hasWon) return true;
    return false;
}

let nextOpenSpace = (board, pos) => {
    for (let i = (pos % 3); i < 9; i += 3) {
        if (board[i] == null) return i;
    }
    return -1; // Returns -1 if no spaces are open
}

module.exports = { adjustBoard, calculateScore, checkWinner, nextOpenSpace };