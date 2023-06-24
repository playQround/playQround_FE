import '../css/Users.css'

const Users = ({ViewLogin, ViewSignin}) => {
    
    return (
        <div className="UserOptionArea"> 
            <button className="SignButton" onClick={ViewLogin}>
                Sign In
            </button>
            
            <button className="SignButton" onClick={ViewSignin}>
                Sign Up
            </button>
            
        </div>
    )
}

export default Users;