import {
    useNavigate,
    Link
} from 'react-router-dom';
import {
    useCallback
} from 'react';
import styled from 'styled-components';

import {
    Button1,
    Div1,
    OuterFlexDiv,
    Logo1
} from '../components/atoms/styled';

const Container = styled(Div1)`
    padding: 0px 15px;
`;

const PaddedButton = styled(Button1)`
    margin: 15px 0px;
`;

function Main(): JSX.Element {
    const navigate = useNavigate();

    const handleLoginClick = useCallback(() => {
        navigate('/login');
    }, [navigate]);

    const handleRegisterClick = useCallback(() => {
        navigate('/register');
    }, [navigate]);

    const handlePasswordResetClick = useCallback(() => {
        navigate('/password/reset');
    }, [navigate]);

    const handlePasswordChangeClick = useCallback(() => {
        navigate('/password/change');
    }, [navigate]);

    return (
        <OuterFlexDiv>
            <Link to={'/'}>
                <Logo1/>
            </Link>
            <Container>
                <PaddedButton onClick={handleLoginClick}>Login</PaddedButton>
                <PaddedButton onClick={handleRegisterClick}>Register</PaddedButton>
                <PaddedButton onClick={handlePasswordResetClick}>Password Reset</PaddedButton>
                <PaddedButton onClick={handlePasswordChangeClick}>Change Password</PaddedButton>
            </Container>
        </OuterFlexDiv>
    );
}

export default Main;
