import '../css/QuizRoom.css'

const EachRoom = ({name, status, now, max}) => {
    const RoomEntrance = () => {
        alert("입장을 시도합니다.")
    }

    return (
        <div className='QuizRoom'  onClick={RoomEntrance}>
            <p> {name} </p>
            <p> {status} </p>
            <p> {now} / {max} </p>
        </div>
    )
}

const QuizRooms = () => {

    const quizRoom = [{
        roomName : "초보만",
        roomStatus : 'waiting',
        nowPeople : 1,
        maxPeople : 8
    },
    {
        roomName : "초보만",
        roomStatus : 'waiting',
        nowPeople : 1,
        maxPeople : 8
    },
    {
        roomName : "초보만",
        roomStatus : 'waiting',
        nowPeople : 1,
        maxPeople : 8
    },
    {
        roomName : "초보만",
        roomStatus : 'waiting',
        nowPeople : 1,
        maxPeople : 8
    },
    {
        roomName : "초보만",
        roomStatus : 'waiting',
        nowPeople : 1,
        maxPeople : 8
    },  {
        roomName : "초보만",
        roomStatus : 'waiting',
        nowPeople : 1,
        maxPeople : 8
    }, {
        roomName : "초보만",
        roomStatus : 'waiting',
        nowPeople : 1,
        maxPeople : 8
    }]

    return (
        <div className='QuizzesRoomArea'>
            { quizRoom.map((item) => {
                return <EachRoom
                            name={item.roomName}
                            status={item.roomStatus}
                            now = {item.nowPeople}
                            max = {item.maxPeople}/>
            }) }
        </div>
        
    )
}

export default QuizRooms;