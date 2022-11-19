import './Game.css'
import Opponent from './Opponent.js'
import Player from './Player.js'
import Lobby from './Lobby.js'
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';


const socket = io(process.env.REACT_APP_SERVER_IP, {
  withCredentials: true,
  extraHeaders: {
    'abcd': 'test',
  },
  transports: ['websocket', 'polling', 'flashsocket'],
}); 

const baseGame = {
  p1: null,
  p2: null,
  p1Board: Array(9).fill(null),
  p2Board: Array(9).fill(null),
  p1DiceRoll: null,
  p2DiceRoll: null,
  p1Score: 0,
  p2Score: 0,
  turn: 1,
  winner: null,
}

let reverseData = (data) => {
  let reversed = 
  {
    p1: data.p1,
    p2: data.p2,
    p1Board: data.p2Board,
    p2Board: data.p1Board,
    p1DiceRoll: data.p2DiceRoll,
    p2DiceRoll: data.p1DiceRoll,
    p1Score: data.p2Score,
    p2Score: data.p1Score,
    turn: data.turn,
    winner: data.winner,
  }
  return reversed;
}

let reverseBoard = (board) => {
  let newBoard = Array(9).fill(null);

  let pos;
  for (let i = 0; i < 3; i++) {
    pos = i + 6;
    for (let j = i % 3; j < 9; j += 3) {
      newBoard[pos] = board[j];
      pos -= 3;
    }
  }
  // reverse the array, but only by columns
  // ex: 0, 3, 6 -> 6, 3, 0, and 2, 5, 8 -> 8, 5, 2
  // otherwise the opposing player's dice rolls get pushed to the bottom
  // of the array, rather than stacked on top

  for (let i = 0; i < 2; i++) {
    for (let j = 8; j > 2; j--) {
      if (newBoard[j] == null && newBoard[j - 3] != null) {
          newBoard[j] = newBoard[j - 3];
          newBoard[j - 3] = null;
      }
    }
  }
  // pushes everything to the end of the array so it mirrors
  // the player's viewpoint
  
  return newBoard;
}

function Game() {
  const [room, setRoom] = useState('');
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState('');
  const [gameState, setGameState] = useState(baseGame);
  const [p2Board, setP2Board] = useState(Array(9).fill(null));

  const rollDice = () => {
    if (isMyTurn() && gameState.p1DiceRoll == null) // can only roll if your roll is null
      socket.emit('roll_dice', room)
  }
  const clickSquare = (i) => {
    if (isMyTurn() && gameState.p1DiceRoll != null) {
      socket.emit('click_square', { room, i });
    }
  }

  const isMyTurn = () => {
    if (socket.id == gameState.p1 && gameState.turn == 1) return true;
    if (socket.id == gameState.p2 && gameState.turn == 2) return true;
    return false;
  }

  const createRoom = () => {
    if (room != '') {
        socket.emit('create_room', room);
        setStatus("Waiting for opponent to join room...");
    }
  }
  const joinRoom = () => {
    if (room != '') {
        socket.emit('join_room', room);
    }
  }

  useEffect(() => {
    socket.on('game_ready', (data) => {
      setActive(true);
      setGameState(baseGame);
      setP2Board(Array(9).fill(null));
      if (socket.id == data.p2) {
        setGameState(reverseData(data));
      }
      else {
        setGameState(data);
      }
      //console.log('in game ready');
    });

    socket.on('dice_rolled', (data) => {
      if (socket.id == data.p2) {
        setGameState(reverseData(data));
      }
      else {
        setGameState(data);
      }
    })

    socket.on('square_clicked', (data) => {
      if (socket.id == data.p2) {
        setGameState(reverseData(data));
        setP2Board(reverseBoard(data.p1Board)); // opponent's board will mirror the players
      }
      else {
        setGameState(data);
        setP2Board(reverseBoard(data.p2Board)); // opponent's board will mirror the players
      }
      //console.log(gameState);
    })

    socket.on('game_finished', (data) => {
      console.log(socket.id == data.p1);
      if (data.winner == 1 && socket.id == data.p1) setStatus("You won!");
      else if (data.winner == 2 && socket.id == data.p2) setStatus("You won!");
      else if (data.winner == 3) setStatus("You tied!");
      else setStatus("You lost!");
      setActive(false);
      setRoom('');
    })
  }, [])

  return (
    
    <div className="Game">
      {<Lobby 
        createRoom={createRoom}
        joinRoom={joinRoom}
        setRoom={setRoom}
        status={status}
        active={active}
      />}
      <Opponent 
        rollDice={() => rollDice()}
        diceRoll={gameState.p2DiceRoll}
        board={p2Board}
        //clickSquare={(i) => clickSquare(i)}
        score={gameState.p2Score}
      />
      <Player 
        rollDice={() => rollDice()}
        diceRoll={gameState.p1DiceRoll}
        board={gameState.p1Board}
        clickSquare={(i) => clickSquare(i)}
        score={gameState.p1Score}
      />
    </div>
  );
}

export default Game;
