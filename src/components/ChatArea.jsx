import "../css/ChatArea.css";
import GameResultWindow from "./GameResultWindow";
import WebRtc from "./WebRtc";
import React, { useState, useRef, useEffect } from "react";

const ChatArea = ({
    userInfo,
    selectedRoom,
    setSelectedRoom,
    selectedRoomInfo,
    socket,
    webRtcSocket,
    localStream,
}) => {
    // 음성 채팅방 연결
    // web RTC 토글 버튼
    const [toggleButton, setToggleButton] = useState(false);

    const WebRtcConnect = (event) => {
        event.stopPropagation();
        setToggleButton(!toggleButton);
    };

    // 방 나갈 때 socket 연결 끊기
    const disconnectRoom = (socket) => {
        socket.emit("leaveRoom", { userName: nickname, room: selectedRoom });
        setSelectedRoom("");
    };

    // 방 입장 시 nickname anonymous인 경우 수정
    const [nickname, setNickname] = useState(userInfo.userName);
    // 유저 아이디 state
    const [userId, setUserId] = useState("");
    useEffect(() => {
        if (userInfo.userName === "anonymous") {
            // 닉네임 설정 요청
            const userInput = prompt("닉네임을 입력해 주세요.");
            // 닉네임 설정
            setNickname(userInput);
            // Id 설정
            const madeUserId = parseInt(
                Date.now().toString() + Math.floor(Math.random() * 100).toString()
            );
            // Id 값 저장
            setUserId(madeUserId);
            // 비로그인 사용자 방 입장
            socket.emit("joinRoom", {
                room: selectedRoom,
                nickname: userInput,
                // 익명유저의 userId는 Data.now와 랜덤 숫자 3자리를 통해 중복 방지
                userId: madeUserId,
            });
        } else {
            setUserId(userInfo.userId);
            // 로그인 사용자 방 입장
            socket.emit("joinRoom", {
                room: selectedRoom,
                nickname: nickname,
                userId: userInfo.userId,
            });
        }
        // 방 입장 state를 true로 변경
        setEnteredRoom(true);
        return () => {};
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

    // "startQuiz" 퀴즈 시작
    const [startQuiz, setStartQuiz] = useState(false);

    // 풀 퀴즈 숫자 정보
    const [remainingQuizzes, setRemainingQuizzes] = useState(10);

    // "quiz" 퀴즈 내용
    const [quiz, setQuiz] = useState({ question: "퀴즈 시작 전" });

    // "readyTime" 퀴즈 시작 카운트 다운
    const [readyTime, setReadyTime] = useState("퀴즈 시작 전");
    // 사용자 측 카운터
    useEffect(() => {
        if (readyTime > 0) {
            const timer = setInterval(() => {
                setReadyTime((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [readyTime]);

    // "quizTime" 퀴즈 푸는 시간 카운트 다운
    const [quizTime, setQuizTime] = useState("카운트 다운");
    // 사용자 측 카운터
    useEffect(() => {
        if (quizTime > 0) {
            const timer = setInterval(() => {
                setQuizTime((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [quizTime]);

    // 맞추는 시간에 따른 점수 변화
    const [point, setPoint] = useState(5);
    useEffect(() => setPoint(quizTime), [quizTime]);
    // 풀이 시간이 줄어듦에 따라 힌트 추가
    const QuizHint = () => {
        if (quiz?.answer?.length >= 3 && quizTime <= 3) {
            // 3초 이하 남았고, 답이 3자리 이상일 때 마지막 글자 오픈
            const que = quiz?.question;
            const ans = quiz?.answer;
            return readyTime
                ? readyTime
                : `${que}(${ans[0]}${"O".repeat(ans.length - 2)}${ans?.[ans.length - 1]})`;
        } else if (quiz?.answer?.length >= 3 && quizTime < 6) {
            // 5초 미만 남았고, 답이 3자리수 이상일 때 첫글자 오픈
            return readyTime
                ? readyTime
                : `${quiz.question}(${quiz?.answer?.[0]}${"O".repeat(quiz?.answer?.length - 1)})`;
        } else if (quizTime > 5) {
            // 5초 초과 남았을 때는 자리수 힌트만 제공
            return readyTime ? readyTime : `${quiz.question}(${"O".repeat(quiz?.answer?.length)})`;
        } else if (quiz?.answer?.length < 3 && quizTime <= 3) {
            // 3초 이하 남았고, 답이 2자리 이하일 때 첫글자 오픈
            return readyTime
                ? readyTime
                : `${quiz.question}(${quiz?.answer?.[0]}${"O".repeat(quiz?.answer?.length - 1)})`;
        } else {
            return readyTime ? readyTime : `${quiz.question}(${"O".repeat(quiz?.answer?.length)})`;
        }
    };

    // 채팅 창
    const chatWindow = useRef(null);

    // 게임 종료 state
    const [terminate, setTerminate] = useState(false);

    // 새 메시지가 도착하면, 스크롤을 아래로 이동
    useEffect(() => {
        if (chatWindow.current) {
            chatWindow.current.scrollTop = chatWindow.current.scrollHeight;
        }
        return () => {};
    }, [messages]);

    if (selectedRoom) {
        // message가 오면, setMessage로 messages state 변경
        socket.on("message", (message) => setMessages([...messages, message]));
        // notice가 와도 setMessage로 messages state 변경
        socket.on("notice", (message) => setMessages([...messages, { notice: message }]));

        // client에서 message를 보내기 위한 함수
        // 게임 시작 전/중/후 메시지 처리
        const sendMessage = (point) => {
            if (startQuiz) {
                socket.emit("messageInGame", {
                    room: selectedRoom,
                    message,
                    nickname,
                    userId,
                    answer: quiz.answer,
                    remainingQuizzes,
                    point: point,
                });
            } else {
                socket.emit("messageOutGame", {
                    room: selectedRoom,
                    message,
                    nickname,
                });
            }

            // message 전송 후 input 창의 message를 초기화
            setMessage("");
        };

        // "startQuiz" 퀴즈 시작
        const handleStartQuiz = () => {
            socket.emit("startQuiz", {
                room: selectedRoom,
                nickname,
                remainingQuizzes,
            });
        };
        // 남은 퀴즈 개수를 받아서 저장
        socket.on("remainingQuizzesNum", (data) => setRemainingQuizzes(data));
        socket.on("participant", (data) => {
            const newParticipant = JSON.parse(data);
            setParticipant([...newParticipant]);
        });
        socket.on("startQuiz", () => {
            setStartQuiz(!startQuiz);
        });
        socket.on("quiz", (newQuiz) => setQuiz(newQuiz));
        socket.on("readyTime", (readyTime) => setReadyTime(readyTime));
        socket.on("quizTime", (quizTime) => setQuizTime(quizTime));
        socket.on("end", () => {
            setTerminate(!terminate);
        });

        // 리턴할 jsx
        return (
            <>
                {terminate ? (
                    <GameResultWindow
                        nickname={nickname}
                        selectedRoom={selectedRoom}
                        socket={socket}
                        participant={participant}
                        userId={userId}
                        setSelectedRoom={setSelectedRoom}
                    />
                ) : (
                    ""
                )}
                <div className="container-fluid">
                    <div id="room-id" className="row row-5">
                        <div className="col-100 room-id">[방 코드] {selectedRoom}</div>
                    </div>
                    <div id="room-name" className="row row-10">
                        <div className="col-100 room-name">{selectedRoomInfo.roomName}</div>
                    </div>
                    <div className="row row-5">
                        <div id="question" className="col-75 text-center">
                            <QuizHint />
                        </div>
                        <div id="quiz-count" className="col-25 text-center">
                            {readyTime ? "퀴즈 시작 전입니다" : quizTime}
                        </div>
                    </div>

                    <div className="row row-70">
                        <div className="col-75">
                            <div ref={chatWindow} id="chat" className="chat-window">
                                {messages.map((message, index) => {
                                    if (typeof message === "object") {
                                        return (
                                            <div key={index} className="text-center">
                                                <span className="chat-notice">
                                                    {message.notice}
                                                </span>
                                            </div>
                                        );
                                    } else if (message.includes(nickname)) {
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
                                    sendMessage(point);
                                }}
                            >
                                <input
                                    type="text"
                                    id="message-input"
                                    className="form-control"
                                    placeholder="채팅을 입력해주세요."
                                    value={terminate ? undefined : message}
                                    onChange={terminate ? undefined : messageChangeHandler}
                                />
                                <div className="input-group-append">
                                    <button
                                        className={
                                            terminate
                                                ? "btn button-disabled"
                                                : "btn btn-outline-secondary"
                                        }
                                        type="button"
                                        onClick={terminate ? undefined : sendMessage}
                                    >
                                        전송
                                    </button>
                                    <button
                                        className={
                                            startQuiz
                                                ? "btn button-disabled"
                                                : "btn btn-outline-secondary"
                                        }
                                        type="button"
                                        onClick={startQuiz ? undefined : handleStartQuiz}
                                    >
                                        {startQuiz ? "진행 중" : "퀴즈시작"}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="col-25 border-left">
                            <div>
                                <div id="participant-list" className="participant-window">
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
                                                    <span className="participant">
                                                        {item.userName}
                                                    </span>
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                            <div>
                                <button onClick={() => disconnectRoom(socket, webRtcSocket)}>
                                    방 나가기
                                </button>
                            </div>
                            <div>
                                <label className="toggle-button">
                                    <input role="switch" type="checkbox" onClick={WebRtcConnect} />
                                    <span> RTC </span>
                                    {toggleButton ? (
                                        <WebRtc
                                            localStream={localStream}
                                            webRtcSocket={webRtcSocket}
                                            selectedRoom={selectedRoom}
                                        />
                                    ) : (
                                        ""
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
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

export default React.memo(ChatArea);
