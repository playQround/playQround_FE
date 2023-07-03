import { useState } from 'react';
import cookie from 'react-cookies';
import '../css/LoginWindow.css';
import axios from 'axios';

const LoginWindow = ({ViewLogin}) => {

    const [email, setEmail] = useState('');
    const ChangeEmail = (event) => {
        setEmail(event.target.value);
    }

    const [password, setPassword] = useState('');
    const ChangePassword = (event) => {
        setPassword(event.target.value);
    }
    
    const RequestLogin = (event) => {
        event.preventDefault();
        const data = {
            userEmail: email,
            userPassword: password,
        }

        axios.post('http://localhost:3000/api/auth/signin', data)
            .then(response => {
                cookie.save('authorization', 'Bearer ' + response.data.token);
                alert(response.data.message);
                ViewLogin();
            })
            .catch(error => {
                event.preventDefault();
                alert(error)
            })
    }

    return (
        <div className="LoginMain">
            <div className="LoginContent">
                <h2> Sign In </h2>

                <form className='LoginBox' onSubmit={RequestLogin}>
                    <input type='text' placeholder='E-mail' value={email} onChange={ChangeEmail}/>
                    <input type='password' placeholder='Password' value={password} onChange={ChangePassword}/>
                    <button className='Submit'> Submit </button>
                </form>

                <button className='SignIn'> Sign In </button>
                <button className='Cancel' onClick={ViewLogin}> Cancel </button>
            </div>
        </div>
    )
}

export default LoginWindow;