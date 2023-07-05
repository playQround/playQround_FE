import "../css/QuizRoom.css";

const EachRoom = ({ socketRoom, name, status, now, max, setSelectedRoom }) => {
    return (
        <div className="QuizRoom" onClick={() => setSelectedRoom(socketRoom)}>
            <p className="RoomName"> {name} </p>
            <p className="RoomStatus"> {status} </p>
            <p className="RoomPeople">
                {" "}
                {now} / {max}{" "}
            </p>
        </div>
    );
};

const QuizRooms = ({ quizRoom, setSelectedRoom }) => {
    return (
        <>
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
                        />
                    );
                })}
            </div>
        </>
    );
};

export default QuizRooms;
