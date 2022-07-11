import {
    useCallback,
    useState
} from 'react';
import styled from 'styled-components';

import RequiredTextField from '../components/atoms/RequiredTextField';
import {
    Button1,
    Form1,
    LeftAlignDiv,
    StyledLink
} from '../components/atoms/styled';
import CenterAlignedPage from '../components/templates/CenterAlignedPage';
import useRequiredValidator from '../hooks/text-validators/useRequiredValidator';

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
    const [emailError, setEmailError] = useState<string|null>(null);

    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState<string|null>(null);

    const [rememberMe, setRememberMe] = useState(false);
    
    const emailValidator = useRequiredValidator('Email is required');
    const passwordValidator = useRequiredValidator('Password is required');

    const handleEmailChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
        setEmailError(emailValidator(event.target.value));
    }, [setEmail, setEmailError, emailValidator]);

    const handlePasswordChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
        setPasswordError(passwordValidator(event.target.value));
    }, [setPassword, setPasswordError, passwordValidator]);

    const handleRememberMeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setRememberMe(event.target.checked);
    }, [setRememberMe]);

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setEmailError(emailValidator(email));
        setPasswordError(passwordValidator(password));
        
        console.log(email, password, rememberMe);
    }, [email, password, rememberMe, emailValidator, passwordValidator]);

    return (
        <Form1 onSubmit={handleSubmit}>
            <MarginBottomLeftAlignDiv>Sign in to start your session</MarginBottomLeftAlignDiv>
            <RequiredTextField
                placeholder='Email'
                value={email}
                onChange={handleEmailChange}
                error={emailError}
            />
            <RequiredTextField
                placeholder='Password'
                type={'password'}
                value={password}
                onChange={handlePasswordChange}
                error={passwordError}
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
        <CenterAlignedPage>
            <>
                <LoginForm/>
                <RegisterNowDiv>
                    {'Don\'t have an account yet?'} &nbsp;
                    <Styled13Link to={'/register'}> Register Now</Styled13Link>
                </RegisterNowDiv>
                <LoginWithSocialForm/>
            </>
        </CenterAlignedPage>
    );
}

export default Login;
