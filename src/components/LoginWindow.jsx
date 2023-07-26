import "../css/LoginWindow.css";
import cookie from "react-cookies";
import { useState } from "react";
import { API } from "../Api";

const LoginWindow = ({ ViewLogin, ViewSignUp }) => {
    const [email, setEmail] = useState("");
    const ChangeEmail = (event) => {
        setEmail(event.target.value);
    };

    const [password, setPassword] = useState("");
    const ChangePassword = (event) => {
        setPassword(event.target.value);
    };

    const RequestLogin = (event) => {
        event.preventDefault();
        const data = {
            userEmail: email,
            userPassword: password,
        };

        API.signIn(data)
            .then((response) => {
                cookie.save("authorization", "Bearer " + response.data.token);
                alert(response.data.message);
                ViewLogin();
            })
            .catch((error) => {
                event.preventDefault();
                alert(error.response.data.message);
            });
    };

    const LoginToSignUp = () => {
        ViewLogin();
        ViewSignUp();
    };

    return (
        <div className="LoginMain">
            <div className="LoginContent">
                <h2> Sign In </h2>

                <form className="LoginBox" onSubmit={RequestLogin}>
                    <input
                        type="text"
                        placeholder="E-mail"
                        value={email}
                        onChange={ChangeEmail}
                        className="FormInput"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={ChangePassword}
                        className="FormInput"
                    />
                    <button className="Submit"> Submit </button>
                </form>

                <div className="Buttons">
                    <button className="SignUp" onClick={LoginToSignUp}>
                        Sign Up
                    </button>
                </div>
                <div className="Buttons">
                    <button className="Cancel" onClick={ViewLogin}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginWindow;
