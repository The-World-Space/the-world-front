import {
    useState,
    useEffect,
    useCallback
} from 'react';
import {
    TextInput1
} from './styled';
import styled from 'styled-components';

interface ContainerProps {
    width: string;
    height: string;
}

const Container = styled.div<ContainerProps>`
    width: ${props => props.width || '100%'};
    height: ${props => props.height || 'auto'};
`;

interface RequiredTextFieldProps {
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    textValidator?: (value: string) => string|null;
    width?: string;
    height?: string;
}

const RequiredTextInput = styled(TextInput1)`
    margin-bottom: 0px;
`;

const IsValidTextDiv = styled.div`
    color: #ff3535;
    font-size: 14px;
    margin-top: 3px;
`;

const MarginDiv = styled.div`
    margin-bottom: 10px;
`;

function defaultTextValidator(value: string): string|null {
    if (value.length === 0) {
        return 'This field is required';
    }

    return null;
}

function RequiredTextField(props: RequiredTextFieldProps): JSX.Element {
    const {
        placeholder,
        value,
        onChange,
        type,
        textValidator,
        width,
        height
    } = props;

    const [errorMessage, setErrorMessage] = useState<string|null>(null);

    useEffect(() => {
        const validator = textValidator || defaultTextValidator;
        const error = validator(value);
        setErrorMessage(error);
    }, [value, textValidator]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e);

        if (textValidator) {
            setErrorMessage(textValidator(e.target.value));
        } else {
            
            setErrorMessage(defaultTextValidator(e.target.value));
        }
    }, []);

    return (
        <Container width={width ?? '100%'} height={height ?? 'auto'}>
            <RequiredTextInput
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                required
            />
            {errorMessage !== null && <IsValidTextDiv>{errorMessage}</IsValidTextDiv>}
            <MarginDiv />
        </Container>
    );
}

export default RequiredTextField;
