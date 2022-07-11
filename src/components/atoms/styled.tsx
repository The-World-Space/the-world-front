import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const OuterFlexDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    min-height: 500px;
    background-color: #111111;
`;

export const InnerFlexForm1 = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    width: 500px;
    background-color: #252729;
    padding: 20px;
    box-sizing: border-box;

    @media (max-width: 768px) {
        width: calc(100% - 40px);
    }
`;

export const InnerFlexDiv1 = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    width: 500px;
    background-color: #252729;
    padding: 20px;
    box-sizing: border-box;

    @media (max-width: 768px) {
        width: calc(100% - 40px);
    }
`;

export const TextInput1 = styled.input`
    width: 100%;
    height: 35px;
    border: none;
    font-size: 15px;
    color: black;
    background-color: white;
    margin-bottom: 20px;
    box-sizing: border-box;
    padding: 0 10px;
`;

export const Button1 = styled.button`
    width: 100%;
    height: 50px;
    border: none;
    background-color: #00bcd4;
    color: white;
    font-size: 15px;
    padding: 0;

    &:hover {
        background-color: #00b0d0;
    }

    &:active {
        background-color: #0097a7;
    }
`;

export const StyledLink = styled(Link)`
    text-decoration: none;
    color: #00bcd4;
`;

export const Logo1 = styled.img`
    width: 100px;
    height: 100px;
    margin-bottom: 20px;

    @media (max-width: 768px) {
        margin-top: 20px;
    }
`;

export const LeftAlignDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    color: #adadad;
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
    color: #adadad;
    margin-bottom: 20px;
`;
