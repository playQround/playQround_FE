import '../css/Users.css'

const Users = ({ViewLogin, ViewSignUp}) => {
    return (
        <div className="UserOptionArea"> 
            <button className="SignButton" onClick={ViewLogin}>
                Sign In
            </button>
            
            <button className="SignButton" onClick={ViewSignUp}>
                Sign Up
            </button>
            
        </div>
    )
}

export default Users;