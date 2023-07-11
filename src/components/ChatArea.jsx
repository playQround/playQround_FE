import "../css/ChatArea.css";
import { useState, useRef, useEffect } from "react";

const ChatArea = ({ userInfo, selectedRoom, setSelectedRoom, socket, webRtcSocket, localVideoRef, localStream }) => {
    // web RTC 토글 버튼
    const [toggleButton, setToggleButton] = useState(true);
    // console.log(toggleButton)
    
    const WebRtcConnect = () => {
        setToggleButton(!toggleButton);
    }

    useEffect(() => {
        if (toggleButton){
            share();
        }
    }, [toggleButton])

    // RTC peerConnection

    let peerInfo = {};
    let selectedCandidate = {};

    const makePeerConnect = async(userId) => {
        // const newUser = new Object()
        // newUser.peerConnection = new RTCPeerConnection({
        //     "iceServers": [{
        //         urls: 'stun:stun.l.google.com:19302'
        //     }]
        // });
        // newUser.peerConnection.addEventListener("icecandidate", icecandidate);
        // newUser.peerConnection.addEventListener("addstream", addStream);
        
        // // for (let track of localStream.getTracks()) {
        // //     await newUser.peerConnection.addTrack(track, localStream);
        // // }
        // setPeerInfo({ peerInfo, userId : newUser })
        peerInfo[userId] = new Object();
        peerInfo[userId].peerConnection = new RTCPeerConnection({
            "iceServers": [{
                urls: 'stun:stun.l.google.com:19302'
            }]
        });
        peerInfo[userId].peerConnection.addEventListener("icecandidate", icecandidate);
        peerInfo[userId].peerConnection.addEventListener("addstream", addStream);
        console.log(localStream)
        for (let track of localStream.getTracks()) {
            await peerInfo[userId].peerConnection.addTrack(track, localStream);
        }
    };

    // 연결 후보 교환
    const icecandidate = (data) => {
        console.log(data)
        if (data.candidate) {
            webRtcSocket.emit("icecandidate", {
                candidate : data.candidate,
                roomId : selectedRoom,
            });
        }
    };

    // 상대 영상 & 비디오 추가
    const addStream = (data) => {
        // let videoArea = document.createElement("video");
        // videoArea.autoplay = true;
        // videoArea.srcObject = data.stream;
        // let container = document.getElementById("container");
        // container.appendChild(videoArea);
    };


    // RTC socket

    // 음성 채팅방 연결
    const share = async() => {
        webRtcSocket.emit('join', selectedRoom);
    }

    // 타 유저 보이스 채널 입장 확인
    webRtcSocket.on('enter', async({
        userId
    }) => {
        console.log("enter: ", userId)
        await makePeerConnect(userId);
        const offer = await peerInfo[userId].peerConnection.createOffer();
        await peerInfo[userId].peerConnection.setLocalDescription(offer);
        webRtcSocket.emit("offer", { offer, roomId: selectedRoom });
    });

    // 기존 유저로부터 보이스 연결 수신을 받음
    webRtcSocket.on("offer", async({
        userId,
        offer
    }) => {
        if (!peerInfo[userId]) {
            console.log("receive offer : ", userId)
            await makePeerConnect(userId);
            await peerInfo[userId].peerConnection.setRemoteDescription(offer);

            const answer = await peerInfo[userId].peerConnection.createAnswer(offer);

            await peerInfo[userId].peerConnection.setLocalDescription(answer);
            webRtcSocket.emit("answer", {
                answer,
                toUserId: userId,
                roomId: selectedRoom,
            });
        }
    });

    // 신규 유저로부터 응답을 받음
    webRtcSocket.on("answer", async({
        userId,
        answer,
        toUserId
    }) => {
        console.log("receive answer : ", userId)
        if (peerInfo[toUserId] === undefined && peerInfo[userId] === undefined) {
            await peerInfo[userId].peerConnection.setRemoteDescription(answer);
        };
    });

    // 연결 후보를 수신 받음
    webRtcSocket.on("icecandidate", async({
        userId,
        candidate
    }) => {
        if (selectedCandidate[candidate.candidate] === undefined) {
            console.log("recevie candidate")
            selectedCandidate[candidate.candidate] = true;
            await peerInfo[userId].peerConnection.addIceCandidate(candidate);
        };
    });


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
                                        : quiz.question + "(" + quiz?.answer?.length + "글자)"}
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
                             <label className="toggle-button">
                                <input role="switch" type="checkbox" onChange={WebRtcConnect}/>
                                <span> RTC </span>
                            </label>
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
