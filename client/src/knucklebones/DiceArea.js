export default function DiceArea(props) {
  let disabled = true; // For disabling the roll button
  if (props.isMyTurn != null) {
    disabled = !props.isMyTurn;
  }
  let placeButton = (props.dropButton) ? null : <button onClick={props.rollDice} disabled={disabled} 
    className='px-4 py-1 text-sm text-yellow-400 font-semibold rounded-full border border-purple-200 enabled:hover:text-white enabled:hover:bg-yellow-600 enabled:hover:border-transparent disabled:text-white disabled:bg-yellow-600 disabled:opacity-50'>Roll Dice</button>;
  let image;
  if (props.diceRoll != null)
    image = <img src={`pictures/dice/${props.diceRoll}.png`} />;
  else
    image = null;
  return (
    <div className="my-auto mr-28 text-center">
      <div className="bg-yellow-400 w-24 h-24 rounded-lg border mb-1">{image}</div>
      {placeButton}
    </div>
  )
}