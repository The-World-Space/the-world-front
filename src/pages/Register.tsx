import {
    useCallback,
    useState
} from 'react';
import styled from 'styled-components';

import RequiredTextField from '../components/atoms/RequiredTextField';
import {
    Button1,
    InnerFlexForm1,
    LeftAlignDiv,
    PaddingDiv,
    StyledLink
} from '../components/atoms/styled';
import CenterAlignedPage from '../components/templates/CenterAlignedPage';
import useEmailValidator from '../hooks/text-validators/useEmailValidator';
import usePasswordConfirmValidator from '../hooks/text-validators/usePasswordConfirmValidator';
import usePasswordValidator from '../hooks/text-validators/usePasswordValidator';
import useRequiredValidator from '../hooks/text-validators/useRequiredValidator';

const TitleDiv = styled.div`
    font-size: 15px;
    color: #adadad;
    margin-bottom: 20px;
`;

const RegisterButton = styled(Button1)`
    margin-top: 50px;
`;

const LoginLink = styled(StyledLink)`
    font-size: 15px;
`;

const MarginTopLeftAlignDiv = styled(LeftAlignDiv)`
    margin-top: 10px;
`;

function RegisterForm(): JSX.Element {
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState<string|null>(null);

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState<string|null>(null);

    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState<string|null>(null);

    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [passwordConfirmError, setPasswordConfirmError] = useState<string|null>(null);

    const usernameValidator = useRequiredValidator('Username must be at least 1 characters long');
    const emailValidator = useEmailValidator();
    const passwordValidator = usePasswordValidator();
    const passwordConfirmValidator = usePasswordConfirmValidator(password);

    const handleUsernameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
        setUsernameError(usernameValidator(event.target.value));
    }, [setUsername, setUsernameError, usernameValidator]);

    const handleEmailChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
        setEmailError(emailValidator(event.target.value));
    }, [setEmail, setEmailError, emailValidator]);

    const handlePasswordChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
        setPasswordError(passwordValidator(event.target.value));
    }, [setPassword, setPasswordError, passwordValidator]);

    const handlePasswordConfirmChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordConfirm(event.target.value);
        setPasswordConfirmError(passwordConfirmValidator(event.target.value));
    }, [setPasswordConfirm, setPasswordConfirmError, passwordConfirmValidator]);

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setUsernameError(usernameValidator(username));
        setEmailError(emailValidator(email));
        setPasswordError(passwordValidator(password));
        setPasswordConfirmError(passwordConfirmValidator(passwordConfirm));

        console.log(username, email, password);
    }, [username, email, password, usernameValidator, emailValidator, passwordValidator, passwordConfirmValidator]);

    return (
        <InnerFlexForm1 onSubmit={handleSubmit}>
            <TitleDiv>
                Register a new membership
            </TitleDiv>
            <RequiredTextField
                placeholder='Username'
                value={username}
                onChange={handleUsernameChange}
                error={usernameError}
            />
            <RequiredTextField
                type='email'
                placeholder='Email'
                value={email}
                onChange={handleEmailChange}
                error={emailError}
            />
            <PaddingDiv height='20px'/>
            <RequiredTextField
                type='password'
                placeholder='Password'
                value={password}
                onChange={handlePasswordChange}
                error={passwordError}
            />
            <RequiredTextField
                type='password'
                placeholder='Confirm Password'
                value={passwordConfirm}
                onChange={handlePasswordConfirmChange}
                error={passwordConfirmError}
            />
            <RegisterButton type='submit'>Register</RegisterButton>
            <MarginTopLeftAlignDiv>
                <LoginLink to={'/login'}>
                    I already have a membership
                </LoginLink>
            </MarginTopLeftAlignDiv>
        </InnerFlexForm1>
    );
}

function Register(): JSX.Element {
    return (
        <CenterAlignedPage>
            <RegisterForm />
        </CenterAlignedPage>
    );
}

export default Register;
