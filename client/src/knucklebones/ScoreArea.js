export default function DiceArea(props) {
  return (
    <div className="ScoreArea text-yellow-400 my-auto ml-28 border border-black rounded-md p-3 text-center text-lg">
      <h2>Score:</h2>
      <h3>{props.score}</h3>
    </div>
  )
}