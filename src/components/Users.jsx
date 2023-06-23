import '../css/Users.css'

const Users = ({ViewLogin}) => {
    
    const UserSignIn = () => {
        alert('');
    }
    
    const UserSignUp = () => {
        alert('회원가입을 시도합니다');
    }
    
    return (
        <div className="UserOptionArea"> 
            <button className="SignButton" onClick={ViewLogin}>
                Sign In
            </button>
            
            <button className="SignButton" onClick={UserSignUp}>
                Sign Up
            </button>
            
        </div>
    )
}

export default Users;