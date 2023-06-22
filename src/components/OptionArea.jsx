import { useState } from "react"
import '../css/OptionArea.css'

const OptionArea = () => {

    const [people, setPeople] = useState(0)

    const maxPeopleChange = (event) => {
        setPeople(event.target.value);
    }

    const [rating, setRating] = useState(0)

    const ratingChange = (event) => {
        setRating(event.target.value);
    }

    return (
        <div className='OptionArea'>
            <div className="Option">
                <label htmlFor='RoomStatus'> 상태 : </label>   
                <select id='RoomStatus'>
                    <option> 전체 </option>
                    <option> 대기중 </option>
                    <option> 진행중 </option>
                </select>
            </div>

            <div className="Option">
                <label htmlFor='MaxPeople'> 최대 인원 : </label>
                <input id='MaxPeople' type='number' onChange={maxPeopleChange} value={people}/>
            </div>

            <div className="Option">
                <label htmlFor='Rating'> 레이팅 : </label>
                <input id='Rating' type='number' onChange={ratingChange} value={rating}/>
            </div>    
        </div>
    )
}

export default OptionArea