import styled from "styled-components";


const Circle1 = styled.div`
    border-radius: 50%;
    position: fixed;
    width: 606px;
    height: 606px;
    left: -202px;
    top: -52px;
    background: #F5EEEB;
    filter: blur(15px);
    z-index: -1;
`;

const Circle2 = styled.div`
    border-radius: 50%;
    position: fixed;
    width: 547px;
    height: 547px;
    right: -46px;
    top: -52px;
    background: #ECE4E1;
    filter: blur(15px);
    z-index: -1;
`;

const Circle3 = styled.div`
    border-radius: 50%;
    position: fixed;
    width: 596px;
    height: 596px;
    margin-right: 75px;
    background: #DFD6D3;
    filter: blur(15px);
    z-index: -1;
`;

const Circle4 = styled.div`
    border-radius: 50%;
    position: fixed;
    width: 533px;
    height: 533px;
    left: -37px;
    bottom: -207px;
    background: #D6C9C4;
    filter: blur(15px);
    z-index: -1;
`;

const Circle5 = styled.div`
    border-radius: 50%;
    position: fixed;
    width: 326px;
    height: 326px;
    bottom: -209px;
    margin-right: 75px;
    background: #B3A7A3;
    filter: blur(15px);
    z-index: -1;
`;

const Circle6 = styled.div`
    border-radius: 50%;
    position: fixed;
    width: 566px;
    height: 566px;
    right: -49px;
    bottom: -207px;
    background: #BEB5B2;
    filter: blur(15px);
    z-index: -1;
`;

const Circle7 = styled.div`
    border-radius: 50%;
    position: fixed;
    width: 93px;
    height: 93px;
    left: 105px;
    margin-top: 200px;
    background: #E1DAD7;
    filter: blur(15px);
    z-index: -1;
`;

const Circle8 = styled.div`
    border-radius: 50%;
    position: fixed;
    width: 135px;
    height: 135px;
    right: 16px;
    margin-top: 150px;
    background: #DCD0CB;
    filter: blur(15px);
    z-index: -1;
`;

function Background() {
    return (
        <>
            <Circle1/>
            <Circle2/>
            <Circle3/>
            <Circle4/>
            <Circle5/>
            <Circle6/>
            <Circle7/>
            <Circle8/>
        </>
    );
}

export default Background;
