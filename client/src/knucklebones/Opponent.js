import Board from './Board.js'
import DiceArea from './DiceArea.js'
import ScoreArea from './ScoreArea.js'

export default function Opponent(props) {
  return (
    <div id="Opponent" className="Side flex h-1/2 justify-center border-black border">
      <DiceArea 
        rollDice = {props.rollDice} 
        diceRoll = {props.diceRoll}
        dropButton = {true}
      />
      <Board 
        board = {props.board}
        clickSquare = {props.clickSquare}
      />
      <ScoreArea 
        score={props.score}
      />
    </div>
  )
}