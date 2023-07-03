import "./App.css";
import { useState, useMemo } from "react";

import cookie from 'react-cookies';

import SelectArea from "./components/SelectArea";
import ChatArea from "./components/ChatArea";
import Users from "./components/Users";
import LoginUsers from "./components/LoginUsers";

import LoginWindow from "./components/LoginWindow";
import SignupWindow from "./components/SignupWindow";
import CreateRoomWindow from "./components/CreateRoomWindow";

import axios from "axios";

function App() {
  const [loginView, setLoginView] = useState(false);
  const ViewLogin = () => {
    setLoginView(!loginView);
  }

  const [signupView, setSignupView] = useState(false);
  const ViewSignup = () => {
    setSignupView(!signupView);
  }

  const [createRoomView, setCreateRoomView] = useState(false);
  const ViewCreateRoom = () => {
    setCreateRoomView(!createRoomView);
  }

  const [userInfo, setUserInfo] = useState({});

  const cookieStatus = useMemo(() => {
    return cookie.load('authorization');
  }, []);

  if (cookieStatus) {
      axios.get('http://localhost:3000/api/users/info', {
        headers : {'authorization': cookieStatus}
      })
        .then(response => setUserInfo(response.data))
        .catch(error => alert(error))
    }

  return (
    <div className="App">
      
      { loginView ? <LoginWindow ViewLogin={ViewLogin}/>  : '' }
      { signupView ? <SignupWindow ViewSignup={ViewSignup}/>  : '' }
      { createRoomView ? <CreateRoomWindow ViewCreateRoom={ViewCreateRoom}/> : ''}

      <header className="Logo"></header>
      <div className="Main">

        <div className="Area1">
          <SelectArea/>
          <ChatArea/>
        </div>

        <div className="Area2">
          { cookieStatus ? <LoginUsers userInfo={userInfo} ViewCreateRoom={ViewCreateRoom}/>
            : <Users ViewLogin={ViewLogin} ViewSignup={ViewSignup}/>}
          
        </div>

      </div>
    </div>
  );
}

export default App;
