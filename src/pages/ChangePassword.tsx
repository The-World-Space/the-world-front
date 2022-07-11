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
    Logo1,
    OuterFlexDiv
} from '../components/atoms/styled';
import useForceUpdate from '../hooks/useForceUpdate';

const TitleDiv = styled.div`
    font-size: 20px;
    color: #adadad;
    margin-bottom: 20px;
`;

const SubmitButton = styled(Button1)`
    margin-top: 30px;
`;

function ChangePasswordForm(): JSX.Element {
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const [updateState, setUpdateState] = useForceUpdate();

    const handlePasswordChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }, [setPassword]);

    const handlePasswordConfirmChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordConfirm(event.target.value);
    }, [setPasswordConfirm]);

    
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

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setUpdateState();
        console.log(password);
    }, [password, setUpdateState]);

    return (
        <Form1 onSubmit={handleSubmit}>
            <TitleDiv>
                Reset Password
            </TitleDiv>
            <RequiredTextField
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                textValidator={passwordValidator}
                updateFlag={updateState}
            />
            <RequiredTextField
                type="password"
                placeholder="Confirm Password"
                value={passwordConfirm}
                onChange={handlePasswordConfirmChange}
                textValidator={passwordConfirmValidator}
                updateFlag={updateState}
            />
            <SubmitButton type='submit'>Change Password</SubmitButton>
        </Form1>
    );
}

function ChangePassword(): JSX.Element {
    return (
        <OuterFlexDiv>
            <Link to={'/'}>
                <Logo1/>
            </Link>
            <ChangePasswordForm />
        </OuterFlexDiv>
    );
}

export default ChangePassword;
