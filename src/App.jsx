import "./App.css";

import SelectArea from "./components/SelectArea";
import QuizRooms from "./components/QuizRooms";
import ChatArea from "./components/ChatArea";
import Users from "./components/Users";

function App() {
  return (
    <div className="App">
      <header className="Logo"></header>
      <div className="Main">

        <div className="Area1">
          {/* <h1> Quizzes Room List </h1> */}
          <SelectArea/>
          <QuizRooms/>
          <ChatArea/>
        </div>

        <div className="Area2">
          <Users/>
        </div>

      </div>
    </div>
  );
}

export default App;
