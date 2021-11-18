
import React from 'react';
import styled from 'styled-components';
import { FORM_FONT_FAMILY, FORM_FONT_SIZE, FORM_FONT_STYLE, FORM_FONT_WEIGHT } from '../../pages/GlobalEnviroment';

export default styled.input`
    width: 366px;
    height: 39px;
    box-sizing: border-box;
    background-color: #fffffe;
    border-radius: 10px;
    border: none;
    margin-top: 13px;
    font-size: ${FORM_FONT_SIZE};
    font-weight: ${FORM_FONT_WEIGHT};
    font-family: ${FORM_FONT_FAMILY};
    font-style: ${FORM_FONT_STYLE};
    padding-left: 20px;
    outline: none;

    display: block;
    
    box-shadow: 5px 5px 20px 0 rgba(0, 0, 0, 0.12);
`;
