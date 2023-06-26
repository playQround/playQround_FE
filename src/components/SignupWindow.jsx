import { useState } from 'react';
import axios from 'axios';
import '../css/SignupWindow.css'
import PasswordChecker from './PasswordChecker';
import PasswordChecker2 from './PasswordChecker2';

const SignupWindow = ({ViewSignup}) => {

    const [email, setEmail] = useState('');
    const ChangeEmail = (event) => {
        setEmail(event.target.value);
    }

    const [name, setName] = useState('');
    const ChangeName = (event) => {
        setName(event.target.value);
    }

    const [password, setPassword] = useState('');
    const ChangePassword = (event) => {
        setPassword(event.target.value);
    }
    
    const [password2, setPassword2] = useState('');
    const ChangePassword2 = (event) => {
        setPassword2(event.target.value);
    }

    const TrySignup = (event) => {
        const data = {
            userEmail : email,
            userName : name,
            userPassword : password,
        }
        axios.post('http://localhost:3000/api/users/signup', data)
            .then(response => {
                console.log(data)   
                alert(response.data.message)})
            .catch(error => alert(`error : ${error}`))
    }   

    return (
        <div className="SignupMain">
            <div className="SignupContent">
                <h2> Sign Up </h2>

                <form className='SignupBox' onSubmit={TrySignup}>
                    <input type='text' placeholder='E-mail' value={email} onChange={ChangeEmail}/>

                    <input type='text' placeholder='userName' value={name} onChange={ChangeName}/>

                    <input type='password' placeholder='Password' value={password} onChange={ChangePassword}/>
                    { password !== '' ? <PasswordChecker password={password}/> : '' }

                    <input type='password' placeholder='Confirm Password' value={password2} onChange={ChangePassword2}/>
                    { password2 !== '' ? <PasswordChecker2 password={password} password2={password2}/> : ''}
                    
                    <button className='Submit'> Submit </button>
                </form>

                <button className='Cancel' onClick={ViewSignup}> Cancel </button>
            </div>
        </div>
    )
}

export default SignupWindow;