import {
    useCallback,
    useState
} from 'react';

import {
    Button1,
    InnerFlexForm1,
    TextInput1,
    Title1Div
} from '../components/atoms/styled';
import CenterAlignedPage from '../components/templates/CenterAlignedPage';

function PasswordResetForm(): JSX.Element {
    const [email, setEmail] = useState('');

    const handleEmailChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }, [setEmail]);

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(email);
    }, [email]);

    return (
        <InnerFlexForm1 onSubmit={handleSubmit}>
            <Title1Div>
                Reset Password
            </Title1Div>
            <TextInput1 type='email' placeholder='Email' value={email} onChange={handleEmailChange} />
            <Button1 type='submit'>Send Password Reset Link</Button1>
        </InnerFlexForm1>
    );
}

function PasswordReset(): JSX.Element {
    return (
        <CenterAlignedPage>
            <PasswordResetForm />
        </CenterAlignedPage>
    );
}

export default PasswordReset;
