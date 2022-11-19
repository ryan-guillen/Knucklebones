export default function DiceArea(props) {
    let placeButton = (props.dropButton) ? null : <button onClick={props.rollDice} className='px-4 py-1 text-sm text-yellow-400 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-yellow-600 hover:border-transparent'>Roll Dice</button>;
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