import '../css/Users.css'

const Users = ({ViewLogin, ViewSignup}) => {
    return (
        <div className="UserOptionArea"> 
            <button className="SignButton" onClick={ViewLogin}>
                Sign In
            </button>
            
            <button className="SignButton" onClick={ViewSignup}>
                Sign Up
            </button>
            
        </div>
    )
}

export default Users;