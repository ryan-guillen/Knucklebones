import Board from './Board.js'
import DiceArea from './DiceArea.js'
import ScoreArea from './ScoreArea.js'

export default function Player(props) {
  return (
    <div id="Player" className="flex-1 flex h-1/2 justify-center border-black border">
      <DiceArea 
        rollDice={props.rollDice} 
        diceRoll={props.diceRoll}
        isMyTurn={props.isMyTurn}
      />
      <Board 
        board={props.board}
        clickSquare={props.clickSquare}
      />
      <ScoreArea 
        score={props.score}
      />
    </div>
  )
}