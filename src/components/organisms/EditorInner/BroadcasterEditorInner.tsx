import React from "react";
import styled from "styled-components";


const SIDE_BAR_WIDTH = 130/* px */;
const EXTENDS_BAR_WIDTH = 464/* px */;

const ExpandBarDiv = styled.div<{opened: boolean}>`
    background: #D7CCC8;
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.12);
    height: 100%;
    width: ${EXTENDS_BAR_WIDTH}px;
    position: absolute;
    left: ${p => p.opened ? SIDE_BAR_WIDTH : SIDE_BAR_WIDTH - EXTENDS_BAR_WIDTH}px;
    transition: left 0.5s;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    pointer-events: all;
`;



interface PropsType {
    worldId: string;
    opened: boolean;
}

function BroadcasterEditorInner({ /*worldId,*/ opened }: PropsType) {
    return (
        <ExpandBarDiv opened={opened}>
            broadcaster
        </ExpandBarDiv>
    );
}


export default React.memo(BroadcasterEditorInner);
