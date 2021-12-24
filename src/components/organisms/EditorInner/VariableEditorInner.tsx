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

const ListContainer = styled.ol`
    display: flex;
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 100%;
    flex-direction: column;
    align-items: center;
`;

const ListItem = styled.li`
    background: #A69B97;
    border-radius: 23px;
    display: flex;
    width: 90%;
    height: 60px;
    margin-top: 20px;
    padding: 7px;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
`;

const ListItemInner = styled.div`
    background: #FFFFFE;
    border-radius: 19px;
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
`;

interface PropsType {
    worldId: string;
    opened: boolean;
}

function VariableEditorInner({ worldId, opened }: PropsType) {
    
    return (
        <ExpandBarDiv opened={opened}>
            <ListContainer>
                <ListItem>
                    <ListItemInner>
                        ^ㅅ^
                    </ListItemInner>
                </ListItem>
                <ListItem>
                    <ListItemInner>
                        ^ㅅ^
                    </ListItemInner>
                </ListItem>
                <ListItem>
                    <ListItemInner>
                        ^ㅅ^
                    </ListItemInner>
                </ListItem>
            </ListContainer>
        </ExpandBarDiv>
    );
}



export default React.memo(VariableEditorInner);
