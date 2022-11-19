import React from 'react'
import Square from './Square.js'

export default function Board(props) {
  let renderSquare = (i) => {
    return <Square 
              value={props.board[i]}
              onClick={() => props.clickSquare(i)}
            />;
  }

  return (
    <div className="Board grid grid-rows-3 grid-cols-3 w-56 my-auto gap-x-2">
      {renderSquare(0)}
      {renderSquare(1)}
      {renderSquare(2)}
      {renderSquare(3)}
      {renderSquare(4)}
      {renderSquare(5)}
      {renderSquare(6)}
      {renderSquare(7)}
      {renderSquare(8)}
    </div>
  )
}