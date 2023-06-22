import "./App.css";

import SelectArea from "./components/SelectArea";
import QuizRooms from "./components/QuizRooms";
import ChatArea from "./components/ChatArea";
import Users from "./components/Users";

function App() {
  return (
    <div className="App">
      <header className="Logo"> img file in here</header>
      <div className="Main">

        <td className="Area1">
          <h1> Quizzes Room List </h1>
          <SelectArea/>
          <QuizRooms/>
          <ChatArea/>
        </td>

        <td className="Area2">
          <Users/>
        </td>

      </div>
    </div>
  );
}

export default App;
