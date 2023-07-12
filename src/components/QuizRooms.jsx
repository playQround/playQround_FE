import "../css/QuizRoom.css";

// 방 상태에 따라서 이름 분류
const RoomStatusCheck = ({ status }) => {
    let className ;
    let roomStatusToString;

    if (status === 0) {
        roomStatusToString = "Waiting";
        className = "Waiting"

    } else if (status === 1){
        roomStatusToString = "Playing";
        className = "Playing"

    } else {
        roomStatusToString = "Done";
        className = "Done"
    }
        
    return <p className={className}> {roomStatusToString} </p>
};


const EachRoom = ({ socketRoom, name, status, now, max, setSelectedRoom }) => {
    let peopleInRoom = "Roompeople";
    if (max === now ){
        peopleInRoom = "RoompeopleMax";
    }

    const EnteringRoom = () => {
        if (max === now){
            alert("최대 인원에 도달했습니다.");
            return 

        } else if (status === 1) {
            alert("진행 중인 방에 입장할 수 없습니다.")
            return 

        } else if (status === 2){
            alert("종료된 방 입니다.")
            return 
        }
        return setSelectedRoom(socketRoom);
    }

    return (
        <div className="QuizRoom" onClick={() => EnteringRoom()}>
            <p className="RoomName"> {name} </p>
            <RoomStatusCheck status={status} />
            <p className={peopleInRoom}>
                {" "}
                {now} / {max}{" "}
            </p>
        </div>
    );
};

const QuizRooms = ({ quizRoom, setSelectedRoom }) => {
    return (
        <div className="QuizzesRoomArea">
            {quizRoom.map((item, index) => {
                return (
                    <EachRoom
                        key={index}
                        socketRoom={item._id}
                        name={item.roomName}
                        status={item.roomStatus}
                        now={item.nowPeople}
                        max={item.maxPeople}
                        setSelectedRoom={setSelectedRoom}
                    />);
            })}
        </div>
    )
};

export default QuizRooms;
