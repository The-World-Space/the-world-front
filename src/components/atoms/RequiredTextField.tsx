import {
    useCallback,
    useEffect,
    useState
} from 'react';
import styled from 'styled-components';

import {
    TextInput1
} from './styled';

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
    updateFlag?: number;
}

interface RequiredTextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    isError?: boolean;
}

const RequiredTextInput = styled(TextInput1)<RequiredTextInputProps>`
    margin-bottom: 0px;
    border: ${ props => props.isError ? '3px solid #ff0000' : '' };
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
        height,
        updateFlag
    } = props;

    const [errorMessage, setErrorMessage] = useState<string|null>(null);
    const [isFirstRender, setIsFirstRender] = useState<boolean>(true);

    useEffect(() => {
        if (isFirstRender) {
            console.log('isFirstRender');
            setIsFirstRender(false);
            return;
        }
        console.log('isNotFirstRender');
        const validator = textValidator || defaultTextValidator;
        const error = validator(value);
        setErrorMessage(error);
    }, [value, textValidator, setErrorMessage, setIsFirstRender, updateFlag]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e);
    }, [onChange]);

    return (
        <Container width={width ?? '100%'} height={height ?? 'auto'}>
            <RequiredTextInput
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                isError={errorMessage !== null}
            />
            {errorMessage !== null && <IsValidTextDiv>{errorMessage}</IsValidTextDiv>}
            <MarginDiv />
        </Container>
    );
}

export default RequiredTextField;
