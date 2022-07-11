import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { MEDIA_MAX_WIDTH } from '../../constants/css';

export const OuterFlexDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    min-height: 500px;
    background-color: ${props => props.theme.colors.background};
`;

export const InnerFlexForm1 = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    width: 500px;
    background-color: ${props => props.theme.colors.secondary};
    padding: 20px;
    box-sizing: border-box;

    @media (max-width: ${MEDIA_MAX_WIDTH}px) {
        width: calc(100% - 40px);
    }
`;

export const InnerFlexDiv1 = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    width: 500px;
    background-color: ${props => props.theme.colors.secondary};
    padding: 20px;
    box-sizing: border-box;

    @media (max-width: ${MEDIA_MAX_WIDTH}px) {
        width: calc(100% - 40px);
    }
`;

export const TextInput1 = styled.input`
    width: 100%;
    height: 35px;
    border: none;
    font-size: 15px;
    color: ${props => props.theme.colors.primaryInverse};
    background-color: ${props => props.theme.colors.background};
    margin-bottom: 20px;
    box-sizing: border-box;
    padding: 0 10px;
`;

export const Button1 = styled.button`
    width: 100%;
    height: 50px;
    border: none;
    background-color: ${props => props.theme.colors.button};
    color: ${props => props.theme.colors.textLightest};
    font-size: 15px;
    padding: 0;

    &:hover {
        background-color: ${props => props.theme.colors.buttonHover};
    }

    &:active {
        background-color: ${props => props.theme.colors.buttonActive};
    }
`;

export const StyledLink = styled(Link)`
    text-decoration: none;
    color: ${props => props.theme.colors.link};

    :hover {
        color: ${props => props.theme.colors.linkHover};
    }

    &:active {
        color: ${props => props.theme.colors.linkActive};
    }
`;

export const Logo1 = styled.img`
    width: 100px;
    height: 100px;
    margin-bottom: 20px;

    @media (max-width: ${MEDIA_MAX_WIDTH}px) {
        margin-top: 20px;
    }
`;

export const LeftAlignDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    font-size: 13px;
`;

interface PaddingDivProps {
    width?: string;
    height?: string;
}

export const PaddingDiv = styled.div<PaddingDivProps>`
    width: ${props => props.width};
    height: ${props => props.height};
`;

export const Title1Div = styled.div`
    font-size: 20px;
    color: ${props => props.theme.colors.textLight};
    margin-bottom: 20px;
`;
