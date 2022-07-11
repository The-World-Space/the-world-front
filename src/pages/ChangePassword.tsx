import {
    useCallback,
    useState
} from 'react';
import styled from 'styled-components';

import RequiredTextField from '../components/atoms/RequiredTextField';
import {
    Button1,
    InnerFlexForm1,
    Title1Div,
} from '../components/atoms/styled';
import CenterAlignedPage from '../components/templates/CenterAlignedPage';
import usePasswordConfirmValidator from '../hooks/text-validators/usePasswordConfirmValidator';
import usePasswordValidator from '../hooks/text-validators/usePasswordValidator';

const SubmitButton = styled(Button1)`
    margin-top: 30px;
`;

function ChangePasswordForm(): JSX.Element {
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState<string|null>(null);

    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [passwordConfirmError, setPasswordConfirmError] = useState<string|null>(null);
    
    const passwordValidator = usePasswordValidator();
    const passwordConfirmValidator = usePasswordConfirmValidator(password);

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

        const passwordError = passwordValidator(password);
        const passwordConfirmError = passwordConfirmValidator(password);

        setPasswordError(passwordError);
        setPasswordConfirmError(passwordConfirmError);

        if (passwordError || passwordConfirmError) {
            return;
        }

        console.log('Password changed');
    }, [password, passwordConfirm, passwordValidator, passwordConfirmValidator]);

    return (
        <InnerFlexForm1 onSubmit={handleSubmit}>
            <Title1Div>
                Reset Password
            </Title1Div>
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
            <SubmitButton type='submit'>Change Password</SubmitButton>
        </InnerFlexForm1>
    );
}

function ChangePassword(): JSX.Element {
    return (
        <CenterAlignedPage>
            <ChangePasswordForm />
        </CenterAlignedPage>
    );
}

export default ChangePassword;
