import "../css/SelectArea.css";
import { useState, useEffect } from "react";
import OptionArea from "./OptionArea";
import QuizRooms from "./QuizRooms";
import ChatArea from "./ChatArea";
import { API } from "../Api";

const SearchArea = ({userInfo, socket}) => {
    const SearchStart = () => {
        API.searchRooms(
            `roomName=${searchRoomName}&roomStatus=${selectRoomStatus}&maxPeople=${people}&cutRating=${rating}`
        )
            .then((response) => setQuizRoom(response.data.rooms))
            .catch((error) => alert(error));
    };

    // 옵션 visible 트리거
    const [option, setOption] = useState(false);
    const OptionToggle = () => setOption(!option);

    const [searchRoomName, setSearchRoomName] = useState("");
    const SearchRoomNameTrack = (event) => setSearchRoomName(event.target.value);

    // 하위 컴포넌트로 값 전달 - option
    const [selectRoomStatus, setSelectedRoomStatus] = useState("");
    const SelectStatus = (event) => setSelectedRoomStatus(event.target.value);

    const [people, setPeople] = useState(0);
    const MaxPeopleChange = (event) => setPeople(event.target.value);

    const [rating, setRating] = useState(0);
    const RatingChange = (event) => setRating(event.target.value);

    // 하위 컴포넌트 전달 - QuizRooms
    const [quizRoom, setQuizRoom] = useState([]);


    const [selectedRoom, setSelectedRoom] = useState("");
    console.log("selected room name:", selectedRoom);

    useEffect(() => {
        API.getRooms()
            .then((response) => {
                setQuizRoom(response.data.rooms);
            })
            .catch((error) => {
                alert(error);
            });
    }, []);

    return (
        <div>
            <div className="SelectArea">
                <div id="SearchForm">
                    <input
                        type="text"
                        placeholder="Search"
                        onChange={SearchRoomNameTrack}
                        value={searchRoomName}
                    />

                    <button onClick={SearchStart}> Search </button>
                    <button className="OptionButton" onClick={OptionToggle}>
                        {" "}
                        Option{" "}
                    </button>
                </div>
            </div>
            {option ? (
                <OptionArea
                    rating={rating}
                    RatingChange={RatingChange}
                    people={people}
                    MaxPeopleChange={MaxPeopleChange}
                    SelectStatus={SelectStatus}
                />
            ) : (
                ``
            )}
            {selectedRoom ? (
                <ChatArea userInfo={userInfo} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} socket={socket}/>
            ) : (
                <QuizRooms quizRoom={quizRoom} setSelectedRoom={setSelectedRoom} />
            )}

        </div>
    );
};

export default SearchArea;
