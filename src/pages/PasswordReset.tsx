import {
    useCallback,
    useState
} from 'react';
import {
    Link
} from 'react-router-dom';
import styled from 'styled-components';

import {
    Button1,
    Form1,
    Logo1,
    OuterFlexDiv,
    TextInput1
} from '../components/atoms/styled';

const TitleDiv = styled.div`
    font-size: 20px;
    color: #adadad;
    margin-bottom: 20px;
`;

function PasswordResetForm(): JSX.Element {
    const [email, setEmail] = useState('');

    const handleEmailChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }, []);

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(email);
    }, [email]);

    return (
        <Form1 onSubmit={handleSubmit}>
            <TitleDiv>
                Reset Password
            </TitleDiv>
            <TextInput1 type='email' placeholder='Email' value={email} onChange={handleEmailChange} />
            <Button1 type='submit'>Send Password Reset Link</Button1>
        </Form1>
    );
}

function PasswordReset(): JSX.Element {
    return (
        <OuterFlexDiv>
            <Link to={'/'}>
                <Logo1/>
            </Link>
            <PasswordResetForm />
        </OuterFlexDiv>
    );
}

export default PasswordReset;
