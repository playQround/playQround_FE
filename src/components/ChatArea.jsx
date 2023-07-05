import "../css/ChatArea.css";
import { useState, useRef } from "react";

const ChatArea = ({ userInfo, selectedRoom, setSelectedRoom, socket }) => {
    // socket 연결 끊기
    const disconnectRoom = (socket) => {
        socket.disconnect();
        setSelectedRoom("");
    };

    // 채팅 목록
    const [messages, setMessages] = useState([]);

    // 방 입장 state
    const [enteredRoom, setEnteredRoom] = useState(false);

    // 채팅 입력 state, handler
    const [message, setMessage] = useState("");
    const messageChangeHandler = (event) => setMessage(event.target.value);

    // 채팅 창
    const chatWindow = useRef(null);

    if (selectedRoom) {
        // 방 입장 후 다시 실행되지 않도록
        if (!enteredRoom) {
            console.log("입장");
            // 방 입장
            socket.emit("joinRoom", {
                room: selectedRoom,
                nickname: userInfo.userName,
            });
            // 방 입장 state를 toggle
            setEnteredRoom(!enteredRoom);
        }

        socket.on("message", (message) => {
            console.log("socket on:", message);
            setMessages([...messages, message]);
        });
        console.log("messages state", messages);

        const sendMessage = () => {
            socket.emit("message", {
                room: selectedRoom,
                message: message,
                nickname: userInfo.userName,
                userid: userInfo.userId,
            });
            setMessage("");
        };

        return (
            <>
                <div className="row">
                    <div className="col-9">
                        <div
                            id="chat"
                            className="border my-3 px-3 py-2"
                            style={{ height: "400px", overflow: "auto" }}
                        >
                            {messages.map((message, index) => {
                                return (
                                    <div key={index} className="chat-individual">
                                        {message}
                                    </div>
                                );
                            })}
                        </div>
                        <form
                            className="input-group mb-3"
                            onSubmit={(event) => {
                                event.preventDefault();
                                sendMessage();
                            }}
                        >
                            <input
                                type="text"
                                id="message-input"
                                className="form-control"
                                placeholder="채팅을 입력해주세요."
                                value={message}
                                onChange={messageChangeHandler}
                            />
                            <div className="input-group-append">
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={sendMessage}
                                >
                                    전송
                                </button>
                            </div>
                        </form>
                    </div>
                    {/* <div className="col-3 border-left">
                        <h3 className="text-center">참여자 목록</h3>
                        <ul id="participant-list" className="list-group list-group-flush"></ul>
                    </div> */}
                </div>

                <button onClick={() => disconnectRoom(socket)}>방 나가기</button>
            </>
        );
    } else {
        return (
            <>
                <div>방 연결이 끊어졌습니다.</div>
                <button onClick={() => setSelectedRoom("")}>대기실로 돌아가기</button>
            </>
        );
    }
};

export default ChatArea;
