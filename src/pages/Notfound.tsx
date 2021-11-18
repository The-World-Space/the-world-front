import React, { useState, useEffect } from "react";
import {
    Link
} from 'react-router-dom'
import styled from "styled-components";
import { ReactComponent as Error404 } from '../components/atoms/Error404.svg';


interface Circle {
    x: number;
    y: number;
    r: number;
    color: number;
}
interface XY {
    x: number;
    y: number;
}

const circleColors = ['B55FDD', '7997FF', '5AB0FF', 'AFF876', 'F8FB67', 'FA9F5D', 'F46969'];

function genCircles(startColor: number) {
    const circles: Circle[] = [];

    let position = 0;
    let i = 0;
    while(position < (window.innerHeight * 2 + window.innerWidth * 2)) {
        let x, y;
        if(position < window.innerWidth) {
            x = position;
            y = 0;
        } else if(position < (window.innerWidth + window.innerHeight)) {
            x = window.innerWidth;
            y = position - window.innerWidth;
        } else if(position < (window.innerWidth * 2 + window.innerHeight)) {
            x = window.innerWidth - (position - window.innerWidth - window.innerHeight);
            y = window.innerHeight;
        } else {
            x = 0;
            y = window.innerHeight - (position - (window.innerWidth * 2 + window.innerHeight));
        }

        circles.push({
            x,
            y,
            r: 110,
            color: (startColor + i) % circleColors.length
        });
        position += 165;
        i++;
    }

    return circles;
}

const RelativeDiv = styled.div`
    position: relative;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    background-color: white;
`;

const Centerer = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

function Circle({ x, y, r, color }: Circle) {
    return (
        <div style={{
            position: 'absolute',
            top: y + 'px',
            left: x + 'px',
            backgroundColor: '#' + circleColors[color],
            width: 2*r + 'px',
            height: 2*r + 'px',
            borderRadius: '100%',
            transform: 'translate(-50%, -50%)'
        }}>
        </div>
    );
}

function CircleContainer() {
    const startColor = Math.floor(Math.random() * circleColors.length);
    const [circles, setCircles] = useState(() => genCircles(startColor));
    
    const [randoms, setRandoms] = useState<XY[]>(() => (
        new Array(10000).fill(null).map(() => ({x:Math.random()*40 - 20, y:Math.random()*40 - 20})) as unknown as XY[]
    ));

    useEffect(() => {
        function onResize() {
            setCircles(() => genCircles(startColor));
        }

        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return (
        <RelativeDiv>
            {
                circles.map((circle, i) => (
                    <Circle key={i} {...{
                        x: circle.x + randoms[i].x,
                        y: circle.y + randoms[i].y,
                        r: circle.r,
                        color: circle.color
                    }}/>
                ))
            }
        </RelativeDiv>
    );
}



const Title = styled.h1`
    margin-top: 90px;
    margin-bottom: 0;
`;

function Notfound(){
    return (
        <div>
            <CircleContainer/>
            <Centerer>
                <Link to="/"><Error404/></Link>
                <Title>404 Not Found :(</Title>
            </Centerer>
        </div>
    );
}

export default Notfound;