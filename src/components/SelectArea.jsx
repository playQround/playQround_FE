import { useState } from 'react'
import OptionArea from './OptionArea';
import '../css/SelectArea.css'

const SearchArea = () => {
    const SearchStart = () => {
        alert('방 검색을 시도합니다');
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

    return (
        <div>
            <div className='SelectArea'>
                <div id="SearchForm">
                    <input type="text" placeholder="Search" onChange={InputValueTrack}/>
                    <button onClick={SearchStart}> Search </button>
                    <button className='OptionButton' onClick={OptionToggle}> Option </button>
                </div>
            </div>
            { option ? <OptionArea/> : ``}
        </div>
    )
}

export default SearchArea