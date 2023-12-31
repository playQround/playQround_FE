import "../css/SignUpWindow.css";
import { useState } from "react";
import cookie from "react-cookies";
import PasswordChecker from "./PasswordChecker";
import PasswordChecker2 from "./PasswordChecker2";
import { API } from "../Api";

const SignUpWindow = ({ ViewSignUp }) => {
    const [email, setEmail] = useState("");
    const ChangeEmail = (event) => setEmail(event.target.value);

    const [name, setName] = useState("");
    const ChangeName = (event) => setName(event.target.value);

    const [password, setPassword] = useState("");
    const ChangePassword = (event) => setPassword(event.target.value);

    const [password2, setPassword2] = useState("");
    const ChangePassword2 = (event) => setPassword2(event.target.value);

    const TrySignUp = (event) => {
        event.preventDefault();
        const data = {
            userEmail: email,
            userName: name,
            userPassword: password,
        };
        API.signUp(data)
            .then((response) => {
                alert(response.data.message);
                signIn(data.userEmail, data.userPassword);
            })
            .catch((error) => {
                console.log(error);
                alert(`${error.response.data.message}`);
            });
    };

    const signIn = (userEmail, userPassword) => {
        API.signIn({ userEmail, userPassword }).then((response) => {
            cookie.save("authorization", "Bearer " + response.data.token);
            alert(response.data.message);
            ViewSignUp();
        });
    };

    return (
        <div className="SignUpMain">
            <div className="SignUpContent">
                <h2> Sign Up </h2>

                <form className="SignUpBox" onSubmit={TrySignUp}>
                    <input
                        type="text"
                        placeholder="E-mail"
                        value={email}
                        onChange={ChangeEmail}
                        className="FormInput"
                    />

                    <input
                        type="text"
                        placeholder="userName"
                        value={name}
                        onChange={ChangeName}
                        className="FormInput"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={ChangePassword}
                        className="FormInput"
                    />
                    {password !== "" ? <PasswordChecker password={password} /> : ""}

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={password2}
                        onChange={ChangePassword2}
                        className="FormInput"
                    />
                    {password2 !== "" ? (
                        <PasswordChecker2 password={password} password2={password2} />
                    ) : (
                        ""
                    )}
                    <div className="ButtonContainer">
                        <button className="SubmitButton"> Submit </button>
                        <button className="CancelButton" onClick={ViewSignUp}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUpWindow;
