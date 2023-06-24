import styled from "styled-components";

const StyledSpan = styled.span`
    color: ${(props) => props.color}`

const PasswordChecker2 = ({ password, password2 }) => {
    const condition = (password, password2) => {
        if (!password2.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d~!@#$%^&*()_+]{8,}$/)){
            return {color: 'red', message: '8자 이상의 영문과 숫자 조합이 필요합니다.'}
        }
        if (password !== password2) {
            return {color : 'red', message : '비밀번호가 일치하지 않습니다'};
        }
        return { color : 'green', message : '사용 가능'};
    }
    const result = condition(password, password2)
    return <StyledSpan color={result.color}> { result.message }</StyledSpan>
}

export default PasswordChecker2;