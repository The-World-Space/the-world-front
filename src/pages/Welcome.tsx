import styled from 'styled-components';

const OuterDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
`;

function Welcome(): JSX.Element {
    return (
        <OuterDiv>
            <h1>Welcome</h1>
        </OuterDiv>
    );
}

export default Welcome;
