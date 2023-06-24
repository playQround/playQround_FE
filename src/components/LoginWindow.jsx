import '../css/LoginWindow.css'

const LoginWindow = ({ViewLogin}) => {
    return (
        <div className="LoginMain">
            <div className="LoginContent">
                <h2> Sign In </h2>

                <form className='LoginBox'>
                    <input type='text' placeholder='E-mail'/>
                    <input type='password' placeholder='Password'/>
                    <button className='Submit'> Submit </button>
                </form>

                <button className='SignIn'> Sign In </button>
                <button className='Cancel' onClick={ViewLogin}> Cancel </button>
            </div>
        </div>
    )
}

export default LoginWindow;