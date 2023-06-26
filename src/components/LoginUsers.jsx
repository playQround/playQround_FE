import cookie from 'react-cookies';

const LoginUsers = () => {
    const Logout = () => {
        cookie.remove('authorization');
        window.location.reload();
    }

    return (
        <div className="LoginUserArea"> 
            <button className="LogoutButton" onClick={Logout}>
                Log Out
            </button>            
        </div>
    )
}

export default LoginUsers;