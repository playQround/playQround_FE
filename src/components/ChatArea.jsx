import "../css/ChatArea.css";
import WebRtc from './WebRtc';
import { useState, useRef, useEffect } from "react";

const ChatArea = ({ userInfo, selectedRoom, setSelectedRoom, selectedRoomInfo, socket, webRtcSocket, localStream, WebRtcConnect, toggleButton }) => {
    // 음성 채팅방 연결
    const share = async() => {
        webRtcSocket.emit('join', selectedRoom);
    }
    
    // let selectedCandidate = {}; 
    
    // RTC peerConnection
    useEffect(() => {
        let peerInfo = {};

        const makePeerConnect = async(userId) => {
            peerInfo[userId] = new Object();
            peerInfo[userId].peerConnection = new RTCPeerConnection({
                "iceServers": [{
                    urls: 'stun:stun.l.google.com:19302'
                }]
            });
            peerInfo[userId].peerConnection.addEventListener("icecandidate", icecandidate);
            peerInfo[userId].peerConnection.addEventListener("addstream", addStream);

            for (let track of localStream.getTracks()) {
                await peerInfo[userId].peerConnection.addTrack(track, localStream);
            }
        };
    
        // 연결 후보 교환
        const icecandidate = (data) => {
            if (data.candidate) {
                webRtcSocket.emit("icecandidate", {
                    candidate : data.candidate,
                    selectedRoom,
                });
            }
        };
    
        // 상대 영상 & 비디오 추가
        const addStream = (data) => {
            console.log("connect", data.stream)
            console.log("connect - ", data.stream[0])
            // console.log(data.stream)
            // let videoArea = document.createElement("video");
            // videoArea.autoplay = true;
            // videoArea.srcObject = data.stream;
            // console.log(videoArea.srcObject)
            // let container = document.getElementById("root");
            // container.appendChild(videoArea);
            return (
                <WebRtc remoteRef={data.stream}/>
            )
        };
    
        // RTC socket

        // 타 유저 보이스 채널 입장 확인
        webRtcSocket.on('enter', async({
            userId
        }) => {
            console.log(userId, "님이 방에 참가")
            console.log(peerInfo)
            await makePeerConnect(userId);
            const offer = await peerInfo[userId].peerConnection.createOffer();
            await peerInfo[userId].peerConnection.setLocalDescription(offer);
            webRtcSocket.emit("offer", { offer, selectedRoom });
            console.log("send offer");
        });
    
        // 기존 유저로부터 보이스 연결 수신을 받음
        webRtcSocket.on("offer", async({
            userId,
            offer
        }) => {
            if (!peerInfo[userId]) {
                await makePeerConnect(userId);
                await peerInfo[userId].peerConnection.setRemoteDescription(offer);
    
                const answer = await peerInfo[userId].peerConnection.createAnswer(offer);
    
                await peerInfo[userId].peerConnection.setLocalDescription(answer);
                webRtcSocket.emit("answer", {
                    answer,
                    toUserId: userId,
                    selectedRoom,
                });
            }
        });
    
        // 신규 유저로부터 응답을 받음
        webRtcSocket.on("answer", async({
            userId,
            answer,
            toUserId
        }) => {
            if (peerInfo[toUserId] === undefined) {
                await peerInfo[userId].peerConnection.setRemoteDescription(answer);
            };
        });
    
        // 연결 후보를 수신 받음
        webRtcSocket.on("icecandidate", async({
            userId,
            candidate
        }) => {
            // if (selectedCandidate[candidate.candidate] === undefined) {
            //     selectedCandidate[candidate.candidate] = true;
                await peerInfo[userId].peerConnection.addIceCandidate(candidate);
            // };
        });

        // 연결 해제 - 타인
        webRtcSocket.on("someoneLeaveRoom", async({ userId }) => {
            console.log(userId, "님이 퇴장")
            if (peerInfo[userId]){
                peerInfo[userId].peerConnection.close();
                delete peerInfo[userId];
                console.log(peerInfo[userId])
            }
        })

        // 연결 해제 - 본인
        webRtcSocket.on("youLeaveRoom", async({ userId }) => {
            for (let user in peerInfo){
                peerInfo[user].peerConnection.close();
                delete peerInfo[user]
            }
            console.log("퇴장", peerInfo);
            webRtcSocket.emit("exit", selectedRoom);
        });

    }, [])

    useEffect(() => {
        if (toggleButton){
            share();
            console.log("연결 시도")
        } else if (toggleButton === false){
            webRtcSocket.emit("leaveRoom", selectedRoom);
            console.log("종료")
        }

    }, [toggleButton])

    // 방 나갈 때 socket 연결 끊기
    const disconnectRoom = (socket, webRtcSocket) => {
        socket.emit("leaveRoom", { ...userInfo, room: selectedRoom });
        webRtcSocket.emit("leaveRoom", selectedRoom);
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
        // notice가 와도 setMessage로 messages state 변경
        socket.on("notice", (message) => setMessages([...messages, { notice: message }]));

        // client에서 message를 보내기 위한 함수
        const sendMessage = () => {
            socket.emit("message", {
                room: selectedRoom,
                message,
                nickname,
                userId: userInfo.userId,
                answer: quiz.answer,
                remainingQuizzes,
                point: 1,
            });
            // message 전송 후 input 창의 message를 초기화
            setMessage("");
        };

        // "startQuiz" 퀴즈 시작
        const handleStartQuiz = () => {
            console.log("clicked handle start quiz");
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
            //console.log("new participant:", newParticipant);
            socket.emit("participant", JSON.stringify(newParticipant));
        });
        socket.on("startQuiz", () => setStartQuiz(!startQuiz));
        socket.on("quiz", (newQuiz) => setQuiz(newQuiz));
        socket.on("readyTime", (readyTime) => setReadyTime(readyTime));
        socket.on("quizTime", (quizTime) => setQuizTime(quizTime));

        // // "quiz" 퀴즈 내용
        // const [quiz, setQuiz] = useState("");

        // // "readyTime" 퀴즈 시작 카운트 다운
        // const [readyTime, setReadyTime] = useState(0);

        // // "quizTime" 퀴즈 푸는 시간 카운트 다운
        // const [quizTime, setQuizTime] = useState(0);
      
        // 콘솔 확인
        //console.log("message:", messages);
        //console.log("roomRecord:", roomRecord);
        // console.log("startQuiz:", startQuiz);
        // console.log("quiz:", quiz);
        //console.log("remaining...", remainingQuizzes);
        // console.log("readyTime:", readyTime);
        // console.log("quizTime:", quizTime);
        // console.log("participant:", participant);

        // 리턴할 jsx
        return (
            <>
                <div className="container-fluid">
                    <div id="room-id" className="row row-5">
                        <div className="col-100 room-id">[방 코드] {selectedRoom}</div>
                    </div>
                    <div id="room-name" className="row row-10">
                        <div className="col-100 room-name">{selectedRoomInfo.roomName}</div>
                    </div>
                    <div className="row row-5">
                        <div id="question" className="col-75 text-center">
                            {readyTime
                                ? readyTime
                                : quiz.question + "(" + quiz?.answer?.length + "글자)"}
                        </div>
                        <div id="quiz-count" className="col-25 text-center">
                            {quizTime}
                        </div>
                    </div>

                    <div className="row row-70">
                        <div className="col-75">
                            <div ref={chatWindow} id="chat" className="chat-window">
                                {messages.map((message, index) => {
                                    if (typeof message === "object") {
                                        console.log(message.notice);
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
                                        className={
                                            startQuiz
                                                ? "btn button-disabled"
                                                : "btn btn-outline-secondary"
                                        }
                                        type="button"
                                        onClick={startQuiz ? undefined : handleStartQuiz}
                                    >
                                        {startQuiz? "진행 중": "퀴즈시작"}
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
                                <button onClick={() => disconnectRoom(socket, webRtcSocket)}>방 나가기</button>
                            </div>
                            <div>
                                  <label className="toggle-button">
                                <input role="switch" type="checkbox" onChange={WebRtcConnect}/>
                                <span> RTC </span>
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

export default ChatArea;
