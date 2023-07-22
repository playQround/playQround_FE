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
                            let rankStyle = "";
                            let iconSrc = `${process.env.PUBLIC_URL}/out_medal.png`;

                            if (player[0] + 1 < 4) {
                                rankStyle = `rank${player[0] + 1}`;
                                iconSrc = `${process.env.PUBLIC_URL}/${player[0] + 1}_medal.png`;
                            }

                            if (player[1].userId === userId) {
                                return (
                                    <div key={index} className={`Oneself ${rankStyle}`}>
                                        <img
                                            className="medal"
                                            src={iconSrc}
                                            alt={`Rank ${player[0] + 1}`}
                                        />
                                        {player[1].userName} 님&nbsp;&nbsp;&nbsp;
                                        {player[1].userScore}점
                                    </div>
                                );
                            } else {
                                return (
                                    <div key={index} className={`Others ${rankStyle}`}>
                                        <img
                                            className="medal"
                                            src={iconSrc}
                                            alt={`Rank ${player[0] + 1}`}
                                        />
                                        {player[0] + 1}등&nbsp;&nbsp;&nbsp;{player[1].userName}
                                        님&nbsp;&nbsp;&nbsp;{player[1].userScore}점
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
