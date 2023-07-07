import "../css/ChatArea.css";
import { useState, useRef, useEffect } from "react";

const ChatArea = ({ userInfo, selectedRoom, setSelectedRoom, socket }) => {
    // 방 나갈 때 socket 연결 끊기
    const disconnectRoom = (socket) => {
        socket.emit("leaveRoom", { ...userInfo, room: selectedRoom });
        setSelectedRoom("");
    };

    // 방 입장 시 nickname anonymous인 경우 수정
    const [nickname, setNickname] = useState(userInfo.userName);
    useEffect(() => {
        if (["anonymous"].includes(userInfo.userName)) {
            const userInput = prompt("닉네임을 입력해 주세요.");
            setNickname(userInput);
            // 비로그인 사용자 방 입장
            socket.emit("joinRoom", {
                room: selectedRoom,
                nickname: userInput,
            });
        } else {
            // 로그인 사용자 방 입장
            socket.emit("joinRoom", {
                room: selectedRoom,
                nickname: nickname,
            });
        }
        // 방 입장 state를 true로 변경
        setEnteredRoom(true);
        console.log("nickname:", nickname);
    }, []);

    // 채팅 목록
    const [messages, setMessages] = useState([]);

    // 방 입장 state
    const [enteredRoom, setEnteredRoom] = useState(false);

    // 참여자 목록 state
    const [participant, setParticipant] = useState([]);

    // "message" 채팅 입력 state, handler
    const [message, setMessage] = useState("");
    const messageChangeHandler = (event) => setMessage(event.target.value);

    // "roomRecord" 방 결과 중간 결과 state
    const [roomRecord, setRoomRecord] = useState({});

    // "startQuiz" 퀴즈 시작
    const [startQuiz, setStartQuiz] = useState(false);

    // "quiz" 퀴즈 내용
    const [quiz, setQuiz] = useState({ question: "퀴즈 시작 전" });

    // "readyTime" 퀴즈 시작 카운트 다운
    const [readyTime, setReadyTime] = useState("퀴즈 시작 전");

    // "quizTime" 퀴즈 푸는 시간 카운트 다운
    const [quizTime, setQuizTime] = useState("카운트 다운");

    // 채팅 창
    const chatWindow = useRef(null);

    // 새 메시지가 도착하면, 스크롤을 아래로 이동
    useEffect(() => {
        if (chatWindow.current) {
            chatWindow.current.scrollTop = chatWindow.current.scrollHeight;
        }
    }, [messages]);

    if (selectedRoom) {
        // message가 오면, setMessage로 messages state 변경
        socket.on("message", (message) => setMessages([...messages, message]));

        // client에서 message를 보내기 위한 함수
        const sendMessage = () => {
            socket.emit("message", {
                room: selectedRoom,
                message: message,
                nickname,
                userid: userInfo.userId,
                answer: quiz.answer,
            });
            // message 전송 후 input 창의 message를 초기화
            setMessage("");
        };

        socket.on("roomRecord", (record) => setRoomRecord(record));

        // "startQuiz" 퀴즈 시작
        const handleStartQuiz = () => {
            console.log("clicked handle start quiz");
            socket.emit("startQuiz", {
                room: selectedRoom,
                nickname,
            });
        };
        socket.on("participant", (data) => {
            const newParticipant = JSON.parse(data);
            setParticipant([...newParticipant]);
            console.log("new participant:", newParticipant);
        });
        socket.on("startQuiz", () => setStartQuiz(!startQuiz));
        socket.on("quize", (newQuiz) => setQuiz(newQuiz));
        socket.on("readyTime", (readyTime) => setReadyTime(readyTime));
        socket.on("quizTime", (quizTime) => setQuizTime(quizTime));

        // // "quiz" 퀴즈 내용
        // const [quiz, setQuiz] = useState("");

        // // "readyTime" 퀴즈 시작 카운트 다운
        // const [readyTime, setReadyTime] = useState(0);

        // // "quizTime" 퀴즈 푸는 시간 카운트 다운
        // const [quizTime, setQuizTime] = useState(0);

        // 콘솔 확인
        // console.log("message:", messages);
        // console.log("roomRecord:", roomRecord);
        // console.log("startQuiz:", startQuiz);
        // console.log("quiz:", quiz);
        // console.log("readyTime:", readyTime);
        // console.log("quizTime:", quizTime);
        // console.log("participant:", participant);

        // 리턴할 jsx
        return (
            <>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-75">
                            <h3 id="room-name" className="py-3">
                                Room Title
                            </h3>
                        </div>
                        <div className="col-25">
                            <h3 id="room-id" className="room-id">
                                [방 코드] {selectedRoom}
                            </h3>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-75 text-center">
                            <div>
                                <h2 id="question" className="">
                                    {readyTime
                                        ? readyTime
                                        : quiz.question + "(" + quiz?.answer.length + "글자)"}
                                </h2>
                            </div>
                        </div>
                        <div className="col-25 text-center">
                            <h3 id="quiz-count" className="text-center">
                                {quizTime}
                            </h3>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-75">
                            <div ref={chatWindow} id="chat" className="chat-window">
                                {messages.map((message, index) => {
                                    if (message.includes(nickname)) {
                                        return (
                                            <div key={index} className="chat-individual">
                                                <span className="chat-oneself">{message}</span>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div key={index} className="chat-individual">
                                                <span className="chat-others">{message}</span>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                            <form
                                className="input-group"
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
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={handleStartQuiz}
                                    >
                                        퀴즈시작
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="col-25 border-left">
                            <ul id="participant-list" className="participant-window">
                                <h3 className="text-center">참여자 목록</h3>
                                {participant.map((item, index) => {
                                    if (startQuiz) {
                                        return (
                                            <div key={index} className="participant-list">
                                                <span className="participant">
                                                    {item.userName} : {item.userScore}
                                                </span>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div key={index} className="participant-list">
                                                <span className="participant">{item.userName}</span>
                                            </div>
                                        );
                                    }
                                })}
                            </ul>
                        </div>
                    </div>
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
