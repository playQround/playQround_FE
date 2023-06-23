import "./App.css";
import { useState } from "react";


import SelectArea from "./components/SelectArea";
import ChatArea from "./components/ChatArea";
import Users from "./components/Users";
import LoginWindow from "./components/LoginWindow";

function App() {
  const [loginView, setLoginView] = useState(false);
  
  const ViewLogin = () => {
    const newLoginView = loginView ? false : true;
    setLoginView(newLoginView);
  }

  return (
    <div className="App">
      { loginView ? <LoginWindow ViewLogin={ViewLogin}/>  : '' }

      <header className="Logo"></header>
      <div className="Main">

        <div className="Area1">
          <SelectArea/>
          <ChatArea/>
        </div>

        <div className="Area2">
          <Users ViewLogin={ViewLogin}/>
        </div>

      </div>
    </div>
  );
}

export default App;
