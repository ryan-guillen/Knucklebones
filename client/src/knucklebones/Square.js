export default function Square(props) {
  let image;
  if (props.value != null)
    image = <img src={`pictures/dice/${props.value}.png`} className='w-full h-full'/>;
  else
    image = null;

  return (
    <div className="aspect-square border-yellow-400 border hover:bg-slate-400" onClick={props.onClick}>
      {image}
    </div>
  )
}