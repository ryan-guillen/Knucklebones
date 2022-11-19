export default function Lobby(props) {
    if (!props.active) {
        return (
            <div className="Lobby bg-black/50 w-full h-full block fixed z-10 overflow-auto">
                <div className="LobbyContent bg-slate-400 border-yellow-400 border-2 rounded-lg w-1/2 h-1/4 p-6 text-center text-md">
                    <h2>Create Lobby:</h2>
                    <input className='rounded-md m-1 border-black border' onChange={(event) => {props.setRoom(event.target.value)}}/>
                    <button className='border-black border rounded-md px-3' onClick={props.createRoom}>Enter</button>
                    <h2>Join Lobby:</h2>
                    <input className='rounded-md m-1 border-black border' onChange={(event) => {props.setRoom(event.target.value)}}/>
                    <button className='border-black border rounded-md px-3' onClick={props.joinRoom}>Enter</button>
                    <p>{props.status}</p>
                </div>
            </div>
        )
    }
    else return null;
}