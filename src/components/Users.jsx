import '../css/Users.css'

const Users = () => {
    const UserSignIn = () => {
        alert('로그인을 시도합니다');
    }

    const UserSignUp = () => {
        alert('회원가입을 시도합니다');
    }

    return (
        <div className="UserOptionArea"> 
            
            <button className="SignButton" onClick={UserSignIn}>
                Sign In
            </button>
            
            <button className="SignButton" onClick={UserSignUp}>
                Sign Up
            </button>
            
        </div>
    )
}

export default Users;