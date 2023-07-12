import "../css/CreateRoomWindow.css";
import { useState } from "react";
import { API } from "../Api";

const CreateRoomWindow = ({ ViewCreateRoom, setSelectedRoom }) => {
    const [roomName, setRoomName] = useState("");
    const ChangeRoomName = (event) => {
        setRoomName(event.target.value);
    };

    const [maxPeople, setMaxPeople] = useState(5);
    const ChangeMaxPeople = (event) => {
        setMaxPeople(event.target.value);
    };

    const [cutRating, setCutRating] = useState(0);
    const ChangeCutRating = (event) => {
        setCutRating(event.target.value);
    };

    const [roomPublic, setRoomPublic] = useState(false);
    const ChangeRoomPublic = () => {
        setRoomPublic(!roomPublic);
    };

    const CreateRoom = (event) => {
        event.preventDefault();
        const data = {
            roomName,
            maxPeople,
            cutRating,
            roomPublic,
        };

        if (roomName === "") {
            alert("방 이름은 필수입니다.");
            return;
        }

        API.createRoom(data)
            .then((response) => {
                // const next = response.data.roomId
                alert(`방을 만들었습니다. (키: ${response.data.roomId})`);
                ViewCreateRoom();
                setSelectedRoom(response.data.roomId);
            })
            .catch((error) => console.log(error));
    };

    return (
        <div className="CreateRoomMain">
            <div className="CreateRoomContent">
                <h2 className="CreateRoomTitle">CreateRoom</h2>

                <form className="CreateRoomBox" onSubmit={CreateRoom}>
                    <label className="FormLabel">
                        방 이름
                        <input
                            type="text"
                            placeholder="방 이름"
                            value={roomName}
                            onChange={ChangeRoomName}
                            className="FormInput"
                        />
                    </label>

                    <label className="FormLabel">최대 인원</label>
                    <input
                        type="number"
                        placeholder="최대 인원"
                        value={maxPeople}
                        onChange={ChangeMaxPeople}
                        className="FormInput"
                    />

                    <label className="FormLabel">입장 점수</label>
                    <input
                        type="number"
                        placeholder="최소 레이팅 점수"
                        value={cutRating}
                        onChange={ChangeCutRating}
                        className="FormInput"
                    />

                    <label className="FormLabel">
                        <input
                            type="checkbox"
                            value={roomPublic}
                            onClick={ChangeRoomPublic}
                            className="FormCheckbox"
                        />
                        비밀 방
                    </label>
                    <div className="ButtonContainer">
                        <button className="SubmitButton">Create</button>
                        <button className="CancelButton" onClick={ViewCreateRoom}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRoomWindow;
