import "./App.css";
import { useState, useEffect, useRef } from "react";
import cookie from "react-cookies";
import SelectArea from "./components/SelectArea";
import Users from "./components/Users";
import LoginUsers from "./components/LoginUsers";
import LoginWindow from "./components/LoginWindow";
import SignUpWindow from "./components/SignUpWindow";
import CreateRoomWindow from "./components/CreateRoomWindow";
import { decodeJwt } from "jose";
import { io } from "socket.io-client";
import { API } from "./Api";

function App() {
    // socket control
    const [socket, setSocket] = useState();
    const [webRtcSocket, setWebRtcSocket] = useState();
    
    useEffect(() => {
        const socketIo = io(process.env.REACT_APP_SERVER_URL);
        setSocket(socketIo);
        
        const webRtcSocketIo = io("http://localhost:3000");
        setWebRtcSocket(webRtcSocketIo);
        return () => {
            if (socket) {
                socket.disconnect();
            }
            if (webRtcSocket){
                webRtcSocket.disconnect();
            }
        };
    }, []);

    // web RTC 
    const localVideoRef = useRef();
    const [localStream, setLocalStream] = useState();
    useEffect(() => {
        const getMedia = async() => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
    
                if (localStream === undefined){
                    setLocalStream(stream);
                }
                console.log("localStream", localStream)
                console.log("streamRef", localVideoRef)
                // localStream = stream;
    
                if (localVideoRef.current) {
                    localVideoRef.current.muted = true;
                    localVideoRef.current.srcObject = stream;
                }
    
            } catch (error) {
                console.log(error);
            }
        };
        getMedia();

    }, [localStream])

    // web RTC 토글 버튼
    const [toggleButton, setToggleButton] = useState(false);
    // console.log(toggleButton)
    
    const WebRtcConnect = () => {
        setToggleButton(!toggleButton);
    }

    // login popup state control
    const [loginView, setLoginView] = useState(false);
    const ViewLogin = () => setLoginView(!loginView);

    // signUp popup state control
    const [SignUpView, setSignUpView] = useState(false);
    const ViewSignUp = () => setSignUpView(!SignUpView);

    // create Room popup state control
    const [createRoomView, setCreateRoomView] = useState(false);
    const ViewCreateRoom = () => setCreateRoomView(!createRoomView);

    // read cookie to check login or not
    const user = cookie.load("authorization");
    const userInfo = user
        ? decodeJwt(user)
        : { userId: -1, userEmail: "anonymous", userName: "anonymous", userRating: 0 };

    API.getUserInfo({ Authorization: cookie.load("authorization") })
        .then((res) => {})
        .catch((error) => console.log("error", error));

    return (
        <div className="App">
            {loginView ? <LoginWindow ViewLogin={ViewLogin} /> : ""}
            {SignUpView ? <SignUpWindow ViewSignUp={ViewSignUp} /> : ""}
            {createRoomView ? <CreateRoomWindow ViewCreateRoom={ViewCreateRoom} /> : ""}

            <header className="Logo"></header>
            <div className="Main">
                <div className="Area1">
                    <SelectArea
                        userInfo={userInfo}
                        socket={socket}
                        webRtcSocket={webRtcSocket}
                        localVideoRef={localVideoRef}
                        localStream={localStream}
                        WebRtcConnect={WebRtcConnect}
                        toggleButton={toggleButton}
                    />
                </div>

                <div className="Area2">
                    {user ? (
                        <LoginUsers userInfo={userInfo} ViewCreateRoom={ViewCreateRoom}  />
                    ) : (
                        <Users ViewLogin={ViewLogin} ViewSignUp={ViewSignUp} />
                    )}
                </div>
            </div>
                <video autoPlay ref={localVideoRef}></video>
        </div>
    );
}

export default App;
