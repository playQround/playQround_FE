import styled from "styled-components";

const StyledSpan = styled.span`
    color: ${(props) => props.color};
`;

const PasswordChecker2 = ({ password, password2 }) => {
    const condition = (password, password2) => {
        if (password !== password2) {
            return { color: "red", message: "비밀번호가 일치하지 않습니다" };
        } else {
            return { color: "green", message: "비밀번호 입력 일치" };
        }
    };
    const result = condition(password, password2);
    return <StyledSpan color={result.color}> {result.message}</StyledSpan>;
};

export default PasswordChecker2;
