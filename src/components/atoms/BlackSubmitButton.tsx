import styled from 'styled-components';
import { FORM_FONT_FAMILY, FORM_FONT_SIZE, FORM_FONT_STYLE, FORM_FONT_WEIGHT } from '../../pages/GlobalEnviroment';

export default styled.button`
width: 366px;
height: 41px;
box-sizing: border-box;
background-color: black;
color: white;
border-radius: 10px;
border: none;
margin-top: 28px;
font-size: ${FORM_FONT_SIZE};
font-weight: ${FORM_FONT_WEIGHT};
font-family: ${FORM_FONT_FAMILY};
font-style: ${FORM_FONT_STYLE};
display: block;
outline: none;

box-shadow: 5px 5px 20px 0 rgba(0, 0, 0, 0.12);

&:active {
    background-color: #111111;
}
`;