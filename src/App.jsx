import "./App.css";
import { useState, useEffect } from "react";
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
    useEffect(() => {
        const socketIo = io(process.env.REACT_APP_SERVER_URL);
        setSocket(socketIo);
    }, []);
    useEffect(() => {
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    });

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
    console.log("name", userInfo);

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
        </div>
    );
}

export default App;
