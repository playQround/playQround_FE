import { useState } from 'react'
import OptionArea from './OptionArea';
import '../css/SelectArea.css'

const SearchArea = () => {
    const SearchStart = () => {
        console.log(selectRoomStatus, people, rating);
    }

    const [option, setOption] = useState(false);
    const OptionToggle = () => {
        const newOption = option ? false : true;
        setOption(newOption);
    }

    const [inputValue, setInputvalue] = useState('');

    const InputValueTrack = (event) => {
        setInputvalue(event.target.value)
    }

    // 하위 컴포넌트로 값 전달
    
    const [selectRoomStatus, setSelectedRoomStatus] = useState('');

    const SelectStatus = (event) => {
        setSelectedRoomStatus(event.target.value)
    }

    const [people, setPeople] = useState(0)

    const MaxPeopleChange = (event) => {
        setPeople(event.target.value);
    }

    const [rating, setRating] = useState(0)

    const RatingChange = (event) => {
        setRating(event.target.value);
    }

    return (
        <div>
            <div className='SelectArea'>
                <div id="SearchForm">
                    <input type="text" placeholder="Search" onChange={InputValueTrack} value={inputValue}/>
                    <button onClick={SearchStart}> Search </button>
                    <button className='OptionButton' onClick={OptionToggle}> Option </button>
                </div>
            </div>
            { option ? <OptionArea 
                            rating={rating}
                            RatingChange={RatingChange}
                            people={people}
                            MaxPeopleChange={MaxPeopleChange}
                            SelectStatus ={SelectStatus}
                        /> : ``}
        </div>
    )
}

export default SearchArea