require('dotenv').config();
const express = require('express');
const app = express();
//const http = require('http');
const https = require('https');
const fs = require("fs");
const cors = require('cors');
app.use(cors());
const { adjustBoard, calculateScore, checkWinner, nextOpenSpace } = require('./src/util/knucklebonesUtil.js');


const server = https.createServer({
        key: fs.readFileSync(process.env.PRIV_KEY),
        cert: fs.readFileSync(process.env.CERT),
    },
    app
);
const pendingRooms = {};
const games = {};
// ip: 174.59.233.223
// url: rinnyginny.net

const io = new require('socket.io')(server, {
    cors: {
        origin: ['http://rinnyginny.net', 'http://localhost, https://rinnyginny.net', 'https://localhost'],
        methods: ["GET", "POST"],
        allowedHeaders: ['abcd'],
        credentials: true,
    }
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`)

    socket.on('create_room', (data) => { // player creates room with number
        socket.join(data);
        pendingRooms[data] = [socket.id];
        console.log(pendingRooms);
    });

    socket.on('join_room', (data) => { // player join rooms with number
        console.log("received");
        if (data in pendingRooms) { // number must be a created room already
            socket.join(data);
            pendingRooms[data].push(socket.id);
            console.log(pendingRooms);
            console.log(pendingRooms[data][0]);
            games[data] = { // create new game
                p1: pendingRooms[data][0],
                p2: socket.id,
                p1Board: Array(9).fill(null),
                p2Board: Array(9).fill(null),
                p1DiceRoll: null,
                p2DiceRoll: null,
                p1Score: 0,
                p2Score: 0,
                turn: 1,
                winner: null,
            }
            io.to(data).emit('game_ready', games[data]);
            console.log(games);
        }
    })

    socket.on('roll_dice', (data) => { // a player rolled the dice
        //console.log('roll');
        if (socket.id == games[data].p1) { // p1 rolled
            games[data].p1DiceRoll = Math.floor(Math.random() * 6) + 1;
            io.to(data).emit('dice_rolled', games[data])
        }
        else { // p2 rolled
            games[data].p2DiceRoll = Math.floor(Math.random() * 6) + 1;
            io.to(data).emit('dice_rolled', games[data])
        }
    })

    socket.on('click_square', (data) => {
        let room = data.room;
        let i = data.i;
        if (socket.id == games[room].p1 && games[room].turn == 1) {
            let newBoard = games[room].p1Board;
            i = nextOpenSpace(newBoard, i);
            if (i != -1) { // if column has space
                //console.log(i);
                let roll = games[room].p1DiceRoll;
                newBoard[i] = roll;
                let newBoards = adjustBoard(newBoard, games[room].p2Board, games[room].turn, i, roll)
                updateBoards(room, newBoards) // if someone has won
                games[room].turn = 2;
            }
        }
        else if (socket.id == games[room].p2 && games[room].turn == 2) {
            let newBoard = games[room].p2Board;
            i = nextOpenSpace(newBoard, i);
            if (i != -1) { // if column has space
                //console.log(i);
                let roll = games[room].p2DiceRoll;
                newBoard[i] = roll;
                let newBoards = adjustBoard(games[room].p1Board, newBoard, games[room].turn, i, roll)
                updateBoards(room, newBoards) // if someone has won
                games[room].turn = 1;
            }
        }
        io.to(room).emit('square_clicked', games[room]);

        if(checkWinner(games[room].p1Board, games[room].p2Board)) {
            console.log(games[room].p1Score);
            console.log(games[room].p2Score);
            if (games[room].p1Score > games[room].p2Score)
                games[room].winner = 1;
            else if (games[room].p1Score < games[room].p2Score)
            games[room].winner = 2;
            else games[room].winner = 3;
            console.log('win');
            io.to(room).emit('game_finished', games[room]);
        }
    })

});

server.listen(25566, () => {
    console.log("SERVER IS RUNNING");
});

let updateBoards = (room, newBoards) => {
    games[room].p1Board = newBoards[0];
    games[room].p2Board = newBoards[1];
    let scores = calculateScore(newBoards[0], newBoards[1]);
    games[room].p1Score = scores[0];
    games[room].p2Score = scores[1];
    games[room].p1DiceRoll = null;
    games[room].p2DiceRoll = null;

    if (checkWinner(newBoards[0], newBoards[1])) return true;
    else return false;
}