import "./App.css";
import { useState } from "react";

import cookie from 'react-cookies';

import SelectArea from "./components/SelectArea";
import ChatArea from "./components/ChatArea";
import Users from "./components/Users";
import LoginWindow from "./components/LoginWindow";
import SignupWindow from "./components/SignupWindow";
import LoginUsers from "./components/LoginUsers";

function App() {
  const [loginView, setLoginView] = useState(false);
  const ViewLogin = () => {
    const newLoginView = loginView ? false : true;
    setLoginView(newLoginView);
  }

  const [signupView, setSignupView] = useState(false)
  const ViewSignup = () => {
    const newViewSignup = signupView ? false : true;
    setSignupView(newViewSignup);
  }

  const cookieStatus = cookie.load('authorization');

  return (
    <div className="App">
      
      { loginView ? <LoginWindow ViewLogin={ViewLogin}/>  : '' }
      { signupView ? <SignupWindow ViewSignup={ViewSignup}/>  : '' }

      <header className="Logo"></header>
      <div className="Main">

        <div className="Area1">
          <SelectArea/>
          <ChatArea/>
        </div>

        <div className="Area2">
          { cookieStatus ? <LoginUsers/>
            : <Users ViewLogin={ViewLogin} ViewSignup={ViewSignup}/>}
          
        </div>

      </div>
    </div>
  );
}

export default App;
