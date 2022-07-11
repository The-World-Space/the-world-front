import {
    useCallback,
    useState
} from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import RequiredTextField from '../components/atoms/RequiredTextField';
import {
    Button1,
    Form1,
    LeftAlignDiv,
    Logo1,
    OuterFlexDiv,
    StyledLink} from '../components/atoms/styled';
import useForceUpdate from '../hooks/useForceUpdate';

const MarginBottomLeftAlignDiv = styled(LeftAlignDiv)`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 18px;
    color: #adadad;
    font-size: 13px;
`;

const SigninArea = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    align-items: center;
    width: 100%;
`;

const HorizontalDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 13px;
    width: 100%;
`;

const Font13Div = styled.div`
    font-size: 13px;
    color: #adadad;
`;

const Styled13Link = styled(StyledLink)`
    font-size: 13px;
`;

const Checkbox = styled.input`
    width: 15px;
    height: 15px;
    border: none;
    padding: 0;
    margin: 0;
    margin-right: 5px;
`;

const RegisterNowDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: start;
    
    width: 500px;
    padding: 18px 20px;
    box-sizing: border-box;

    @media (max-width: 768px) {
        width: calc(100% - 40px);
    }
    
    color: #adadad;
    font-size: 13px;
`;

const SignInWithSocialDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    
    width: 500px;
    padding: 18px 20px;
    box-sizing: border-box;

    @media (max-width: 768px) {
        width: calc(100% - 40px);
    }

    background-color: #252729;
    color: #adadad;
`;

const SigninWithGoogleButton = styled(Button1)`
    background-color: #c4ebff;

    &:hover {
        background-color: #b2e5ff;
    }

    &:active {
        background-color: #7ed4ff;
    }

    margin-bottom: 10px;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    padding: 0px 40px;

    color: #252729;

    position: relative;
`;

const GoogleLogo = styled.img`
    width: 20px;
    height: 20px;

    position: absolute;
    left: 20px;
`;

function LoginForm(): JSX.Element {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const [updateState, setUpdateState] = useForceUpdate();

    const handleEmailChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }, [setEmail]);

    const handlePasswordChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }, [setPassword]);

    const handleRememberMeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setRememberMe(event.target.checked);
    }, [setRememberMe]);

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(email, password, rememberMe);
        setUpdateState();
    }, [email, password, rememberMe, setUpdateState]);

    const emailValidator = useCallback((email: string): string|null => {
        if (email.length === 0) {
            return 'Email is required';
        }

        return null;
    }, []);

    const passwordValidator = useCallback((password: string): string|null => {
        if (password.length === 0) {
            return 'Password is required';
        }

        return null;
    }, []);

    return (
        <Form1 onSubmit={handleSubmit}>
            <MarginBottomLeftAlignDiv>Sign in to start your session</MarginBottomLeftAlignDiv>
            <RequiredTextField
                placeholder='Email'
                value={email}
                onChange={handleEmailChange}
                textValidator={emailValidator}
                updateFlag={updateState}
            />
            <RequiredTextField
                placeholder='Password'
                type={'password'}
                value={password}
                onChange={handlePasswordChange}
                textValidator={passwordValidator}
                updateFlag={updateState}
            />
            <SigninArea>
                <HorizontalDiv>
                    <Font13Div>
                        <Checkbox type={'checkbox'} checked={rememberMe} onChange={handleRememberMeChange} />
                        Remember Me
                    </Font13Div>
                    <Styled13Link to={'/password/reset'}>
                        I forgot my password
                    </Styled13Link>
                </HorizontalDiv>
                <Button1 type={'submit'}>Sign In</Button1>
            </SigninArea>
        </Form1>
    );
}

function LoginWithSocialForm(): JSX.Element {
    const [rememberMe, setRememberMe] = useState(false);

    const handleRememberMeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setRememberMe(event.target.checked);
    }, []);

    return (
        <SignInWithSocialDiv>
            <MarginBottomLeftAlignDiv>{'Sign in with'}</MarginBottomLeftAlignDiv>
            <SigninWithGoogleButton>
                <GoogleLogo src={'/static/GoogleLogo.svg'} />
                Google
            </SigninWithGoogleButton>
            <Font13Div>
                <Checkbox type={'checkbox'} checked={rememberMe} onChange={handleRememberMeChange}/>
                Remember Me
            </Font13Div>
        </SignInWithSocialDiv>
    );
}

function Login(): JSX.Element {
    return (
        <OuterFlexDiv>
            <Link to={'/'}>
                <Logo1/>
            </Link>
            <LoginForm/>
            <RegisterNowDiv>
                {'Don\'t have an account yet?'} &nbsp;
                <Styled13Link to={'/register'}> Register Now</Styled13Link>
            </RegisterNowDiv>
            <LoginWithSocialForm/>
        </OuterFlexDiv>
    );
}

export default Login;
