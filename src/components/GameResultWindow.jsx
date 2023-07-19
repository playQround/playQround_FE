import "../css/GameResultWindow.css";

function GameResultWindow({
    socket,
    participant,
    userId,
    setSelectedRoom,
    selectedRoom,
    nickname,
}) {
    const backToMain = () => {
        socket.emit("leaveRoom", { userName: nickname, room: selectedRoom });
        setSelectedRoom("");
    };
    return (
        <>
            <div className="ResultMain">
                <div className="ResultContent">
                    {participant
                        .map((player, index) => [index, player])
                        .filter((value) => value[0] < 3 || value[1].userId === userId)
                        .map((player, index) => {
                            if (player[1].userId === userId) {
                                return (
                                    <div key={index} className="Oneself">
                                        <span className="OneselfRank">{player[0] + 1}</span>
                                        <span>등&nbsp;&nbsp;&nbsp;</span>
                                        <span className="OneselfName">{player[1].userName}</span>
                                        <span>님&nbsp;&nbsp;&nbsp;</span>
                                        <span className="OneselfScore">{player[1].userScore}</span>
                                        <span>점</span>
                                    </div>
                                );
                            } else {
                                return (
                                    <div key={index} className="Others">
                                        <span className="OneselfRank">{player[0] + 1}</span>
                                        <span>등&nbsp;&nbsp;&nbsp;</span>
                                        <span className="OthersName">{player[1].userName}</span>
                                        <span>님&nbsp;&nbsp;&nbsp;</span>
                                        <span className="OthersScore">{player[1].userScore}</span>
                                        <span>점</span>
                                    </div>
                                );
                            }
                        })}
                    <div>
                        <button onClick={backToMain}>나가기</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default GameResultWindow;
