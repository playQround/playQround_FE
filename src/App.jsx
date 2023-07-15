import "./App.css";
import { useState, useEffect, useRef, useCallback } from "react";
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
        const webRtcSocketIo = io("http://localhost:3000/");
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
                    // video: true,
                    audio: true,
                });
                if (localStream === undefined){
                    
                    setLocalStream(stream);
                }
    
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

    // login popup state control
    const [loginView, setLoginView] = useState(false);
    const ViewLogin = () => setLoginView(!loginView);

    // signUp popup state control
    const [SignUpView, setSignUpView] = useState(false);
    const ViewSignUp = () => setSignUpView(!SignUpView);

    // create Room popup state control
    const [createRoomView, setCreateRoomView] = useState(false);
    const ViewCreateRoom = () => setCreateRoomView(!createRoomView);

    // Room 선택 state
    const [selectedRoom, setSelectedRoom] = useState("");
    // console.log("app.jsx selectedRoom:", selectedRoom);

    // read cookie to check login or not
    const token = cookie.load("authorization");
    let userInfo;
    // if there is a token, check if it has expired,
    if (token && decodeJwt(token).exp < parseInt(Date.now() / 1000)) {
        // delete token and
        cookie.remove("authorization");
        // set user information as anonymous again,
        userInfo = { userId: -1, userEmail: "anonymous", userName: "anonymous", userRating: 0 };
    } else if (token) {
        // if token has not expired, try login
        API.getUserInfo({ Authorization: cookie.load("authorization") })
            .then((res) => {
                userInfo.userRating = res.data.userRating;
            })
            .catch((error) => console.log("error", error));
        userInfo = decodeJwt(token);
    } else {
        // if there is no token save user information as anonymous
        userInfo = { userId: -1, userEmail: "anonymous", userName: "anonymous", userRating: 0 };
    }

    return (
        <div className="App">
            {loginView ? <LoginWindow ViewLogin={ViewLogin} ViewSignUp={ViewSignUp} /> : ""}
            {SignUpView ? <SignUpWindow ViewSignUp={ViewSignUp} /> : ""}
            {createRoomView ? (
                <CreateRoomWindow
                    ViewCreateRoom={ViewCreateRoom}
                    setSelectedRoom={setSelectedRoom}
                />
            ) : (
                ""
            )}

            <header className="Logo"></header>
            <div className="Main">
                <div className="Area1">
                    <SelectArea
                        userInfo={userInfo}
                        socket={socket}
                        webRtcSocket={webRtcSocket}
                        localVideoRef={localVideoRef}
                        localStream={localStream}
                        selectedRoom={selectedRoom}
                        setSelectedRoom={setSelectedRoom}
                    />
                </div>

                <div className="Area2">
                    {token ? (
                        <LoginUsers userInfo={userInfo} ViewCreateRoom={ViewCreateRoom} />
                    ) : (
                        <Users ViewLogin={ViewLogin} ViewSignUp={ViewSignUp} />
                    )}
                    <video autoPlay ref={localVideoRef}></video>
                </div>
            </div>
        </div>
    );
}

export default App;
