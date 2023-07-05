import "../css/CreateRoomWindow.css";
import { useState } from "react";
import { API } from "../Api";

const CreateRoomWindow = ({ ViewCreateRoom }) => {
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
                window.location.reload();
            })
            .catch((error) => console.log(error));
    };

    return (
        <div className="CreateRoomMain">
            <div className="CreateRoomContent">
                <h2> CreateRoom </h2>

                <form className="CreateRoomBox" onSubmit={CreateRoom}>
                    <label>
                        {" "}
                        방 이름
                        <input
                            type="text"
                            placeholder="방 이름"
                            value={roomName}
                            onChange={ChangeRoomName}
                        />
                    </label>

                    <label> 최대 인원 </label>
                    <input
                        type="number"
                        placeholder="최대 인원"
                        value={maxPeople}
                        onChange={ChangeMaxPeople}
                    />

                    <label> 입장 점수 </label>
                    <input
                        type="number"
                        placeholder="최소 레이팅 점수"
                        value={cutRating}
                        onChange={ChangeCutRating}
                    />

                    <label>
                        <input type="checkbox" value={roomPublic} onClick={ChangeRoomPublic} />
                        <span className="slider"></span>
                    </label>

                    <button className="Submit"> Create </button>
                </form>

                <button className="Cancel" onClick={ViewCreateRoom}>
                    {" "}
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default CreateRoomWindow;
