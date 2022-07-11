import styled from 'styled-components';
import { Link } from 'react-router-dom';

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
