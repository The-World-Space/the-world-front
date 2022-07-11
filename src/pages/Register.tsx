import {
    useCallback,
    useState
} from 'react';
import {
    Link
} from 'react-router-dom';
import styled from 'styled-components';

import RequiredTextField from '../components/atoms/RequiredTextField';
import {
    Button1,
    Form1,
    LeftAlignDiv,
    Logo1,
    OuterFlexDiv,
    StyledLink} from '../components/atoms/styled';

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
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const handleUsernameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    }, [setUsername]);

    const handleEmailChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }, [setEmail]);

    const handlePasswordChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }, [setPassword]);

    const handlePasswordConfirmChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordConfirm(event.target.value);
    }, [setPasswordConfirm]);

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(username, email, password);
    }, [username, email, password]);

    const usernameValidator = useCallback((value: string): string|null => {
        if (value.length < 1) {
            return 'Username must be at least 1 characters long';
        }

        return null;
    }, []);

    const emailValidator = useCallback((email: string): string|null => {
        if (email.length === 0) {
            return 'Email is required';
        }

        //regular expression for email validation
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regex.test(email)) {
            return 'Email is invalid';
        }

        return null;
    }, []);

    const passwordValidator = useCallback((password: string): string|null => {
        if (password.length === 0) {
            return 'Password is required';
        }

        if (password.length < 8) {
            return 'Password must be at least 8 characters';
        }

        return null;
    }, []);

    const passwordConfirmValidator = useCallback((passwordConfirm: string): string|null => {
        if (passwordConfirm.length === 0) {
            return 'Password confirmation is required';
        }

        if (passwordConfirm !== password) {
            return 'Password confirmation does not match';
        }

        return null;
    }, [password]);

    return (
        <Form1 onSubmit={handleSubmit}>
            <TitleDiv>
                Register a new membership
            </TitleDiv>
            <RequiredTextField
                placeholder='Username'
                value={username}
                onChange={handleUsernameChange}
                textValidator={usernameValidator}
            />
            <RequiredTextField
                type='email'
                placeholder='Email'
                value={email}
                onChange={handleEmailChange}
                textValidator={emailValidator}
            />
            <RequiredTextField
                type='password'
                placeholder='Password'
                value={password}
                onChange={handlePasswordChange}
                textValidator={passwordValidator}
            />
            <RequiredTextField
                type='password'
                placeholder='Confirm Password'
                value={passwordConfirm}
                onChange={handlePasswordConfirmChange}
                textValidator={passwordConfirmValidator}
            />
            <RegisterButton type='submit'>Register</RegisterButton>
            <MarginTopLeftAlignDiv>
                <LoginLink to={'/login'}>
                    I already have a membership
                </LoginLink>
            </MarginTopLeftAlignDiv>
        </Form1>
    );
}

function Register(): JSX.Element {
    return (
        <OuterFlexDiv>
            <Link to={'/'}>
                <Logo1/>
            </Link>
            <RegisterForm />
        </OuterFlexDiv>
    );
}

export default Register;
