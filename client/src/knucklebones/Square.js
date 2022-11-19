export default function Square(props) {
  let image;
  if (props.value != null)
    image = <img src={`pictures/dice/${props.value}.png`} className='w-full h-full'/>;
  else
    image = null;

  return (
    <div className="Square border-yellow-400 border min-w-full min-h-full hover:bg-slate-400" onClick={props.onClick}>
      {image}
    </div>
  )
}