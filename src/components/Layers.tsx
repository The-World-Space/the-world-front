import React from 'react';
import styled from 'styled-components';
import BitCanvas from './BitCanvas';


export const CANVAS_ZINDEX = {
    floor: 0,
    customfloor: 1,

    wall: 10,
    customWall: 11,

    ceil: 20,
    customCeil: 21,
};

const canvasList = Object.entries(CANVAS_ZINDEX).map(([key, zIndex])=> (
    <BitCanvas 
        key={key}
        style={{
            zIndex,
            position: 'absolute',
            width: '100%',
            height: '100%',
        }} 
    />
))


interface Props {

}

type HTMLDivProps = 
    React.HTMLProps<HTMLDivElement> & 
    React.HTMLAttributes<HTMLDivElement>;


function Layers({ ...rest}: Props & HTMLDivProps) {
    return(
        <div {...rest}>
            {canvasList}
        </div>
    );
}

export default Layers;
