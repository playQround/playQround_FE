import '../css/OptionArea.css'

const StatusList = ({eachRoomStatus}) => {
    if (eachRoomStatus.id !== 2) {
      return <option value={eachRoomStatus.id}> { eachRoomStatus.value } </option>
    }
}

const OptionArea = ({rating, RatingChange, people, MaxPeopleChange, SelectStatus}) => {
    
    // 여기서의 전체는, 대기중 + 게임중
    const roomStatus = [{id: 3, value: "전체"},
                        {id: 0, value: "대기중"},
                        {id: 1, value: "게임중"},
                        {id: 2, value: "종료됨"}]

    return (
        <div className='OptionArea'>
            <div className="Option">
                <label htmlFor='RoomStatus'> 상태 : </label>   
                <select id='RoomStatus' onChange={SelectStatus}>
                    { roomStatus.map((eachRoomStatus) => {
                        return <StatusList 
                                    key={eachRoomStatus.id}
                                    eachRoomStatus={eachRoomStatus}/>
                    })}
                </select>
            </div>

            <div className="Option">
                <label htmlFor='MaxPeople'> 최대 인원 : </label>
                <input id='MaxPeople' type='number' onChange={MaxPeopleChange} value={people}/>
            </div>

            <div className="Option">
                <label htmlFor='Rating'> 레이팅 : </label>
                <input id='Rating' type='number' onChange={RatingChange} value={rating}/>
            </div>    
        </div>
    )
}

export default OptionArea