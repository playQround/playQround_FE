import "../css/LoginUsers.css"
import cookie from 'react-cookies';

const LoginUsers = ({ userInfo, ViewCreateRoom }) => {
    const Logout = () => {
        cookie.remove('authorization');
        window.location.reload();
    }

    return (
        <div className="LoginUserArea"> 
            <div className='UserInfoArea'>
                <p>
                    {userInfo.userName}
                </p>
                <p>
                    {userInfo.userEmail}
                </p>
                <p>
                    Rating : {userInfo.userRating}
                </p>
            </div>
            <button className="LogoutButton" onClick={Logout}>
                Log Out
            </button>
            
            <button className='CreateRoomButton' onClick={ViewCreateRoom}>
                Create Room
            </button>
        </div>
    )
}

export default LoginUsers;