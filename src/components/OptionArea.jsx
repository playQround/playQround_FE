import '../css/OptionArea.css'

const StatusList = ({eachRoomStatus}) => {
    {if (eachRoomStatus === '전체') {
      return <option value=''> { eachRoomStatus } </option>
    }}
    return <option value={eachRoomStatus}> { eachRoomStatus } </option>
}

const OptionArea = ({
            rating, RatingChange, 
            people, MaxPeopleChange, 
            SelectStatus}) => {
    
    const roomStatus = ['전체', '대기중', '진행중']

    return (
        <div className='OptionArea'>
            <div className="Option">
                <label htmlFor='RoomStatus'> 상태 : </label>   
                <select id='RoomStatus' onChange={SelectStatus}>
                    { roomStatus.map((eachRoomStatus, index) => {
                        return <StatusList 
                                    key={index}
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