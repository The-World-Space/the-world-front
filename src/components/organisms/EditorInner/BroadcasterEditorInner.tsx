import { ApolloClient, gql, useApolloClient } from "@apollo/client";
import React, { ChangeEventHandler, FocusEventHandler, useEffect, useState } from "react";
import styled from "styled-components";
import { globalApolloClient } from "../../../game/connect/gql";
import { Server } from "../../../game/connect/types";
import PlusIcon from "../../atoms/PlusIcon.svg";
import { FANCY_SCROLLBAR_CSS } from "./FieldEditorInner";

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
    pointer-events: all;
    
    overflow-y: scroll;

    ${FANCY_SCROLLBAR_CSS}
`;


const ListContainer = styled.ol`
    display: flex;
    padding: 0px;
    margin: 0px;
    width: 100%;
    flex-direction: column;
    align-items: center;
    list-style: none;
`;

const StyledListItem = styled.li`
    background: #A69B97;
    border-radius: 23px;
    width: 90%;
    margin-top: 20px;
    padding: 7px;
    display: flex;
    flex-direction: column;
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.12);
`;

const ListItemTitle = styled.input`
    background: #FFFFFE;
    border-radius: 17px;
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    padding-left: 20px;
    height: 40px;
    box-sizing: border-box;

    border-style: none;
`;

const AddContainer = styled.div`
    margin-top: 20px;
    margin-bottom: 40px;
    display: flex;
    justify-content: center;
`;

const AddButton = styled.div`
    background-image: url(${PlusIcon});
    background-size: cover;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    &:hover {
        cursor: pointer;
    }
`;

const DeleteButton = styled.div`
    width: 24px;
    height: 24px;
    &:hover {
        cursor: pointer
    }

    position: absolute;
    right: 10px;
    top: 20px;
    transform: translate(0, -50%);

    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        cursor: pointer;
    }
`;

const ListItemTitleBox = styled.div`
    position: relative;
`;

interface PropsType {
    worldId: string;
    opened: boolean;
}


function ListItem({ broadcaster, update }: { broadcaster: Server.GlobalBroadcaster, update: (broadcaster: Partial<Server.Broadcaster>) => void }) {
    const apolloClient = useApolloClient();

    const onNameChange: ChangeEventHandler<HTMLInputElement> = e => {
        update({ name: e.target.value });
    };

    const onNameBlur: FocusEventHandler<HTMLInputElement> = () => {
        updateBroadcaster(apolloClient, broadcaster.id, broadcaster.name);
    };
    const onClickDeleteButton = () => {
        deleteBroadcaster(apolloClient, broadcaster.id);
    };

    return (
        <StyledListItem>
            <ListItemTitleBox>
                <ListItemTitle value={broadcaster.name} onChange={onNameChange} onBlur={onNameBlur} placeholder="Broadcaster Name"/>
                <DeleteButton onClick={onClickDeleteButton}>X</DeleteButton>
            </ListItemTitleBox>
        </StyledListItem>
    );
}

function BroadcasterEditorInner({ worldId, opened }: PropsType) {
    const [broadcasters, setBroadcasters] = useState<Server.GlobalBroadcaster[]>([]);

    const onAddButtonClick = () => {
        createGlobalBroadcaster(globalApolloClient, worldId, "");
    };

    useEffect(() => {
        (async () => {
            const broadcasters = await getGlobalBroadcasters(globalApolloClient, worldId);
            setBroadcasters(broadcasters);
        })();
    }, [worldId]);

    useEffect(() => {
        let broadcasterCreatingSubscription: undefined | ZenObservable.Subscription;
        let broadcasterUpdatingSubscription: undefined | ZenObservable.Subscription;
        let broadcasterDeletingSubscription: undefined | ZenObservable.Subscription;
        (async () => {
            broadcasterCreatingSubscription =
                (await getGlobalBroadcasterCreatingObservable(globalApolloClient, worldId))
                    .subscribe(broadcaster => {
                        setBroadcasters(broadcasters => [...broadcasters, broadcaster]);
                    });
            broadcasterUpdatingSubscription = 
                (await getBroadcasterUpdatingObservable(globalApolloClient, worldId))
                    .subscribe(broadcaster => {
                        setBroadcasters(broadcasters => broadcasters.map(broadcaster_ => broadcaster_.id === broadcaster.id ? { ...broadcaster_, ...broadcaster } : broadcaster_));
                    });
            broadcasterDeletingSubscription =
                (await getBroadcasterDeletingObservable(globalApolloClient, worldId))
                    .subscribe(id => {
                        setBroadcasters(broadcasters => broadcasters.filter(broadcaster => broadcaster.id !== id));
                    });
        })();

        return () => {
            broadcasterCreatingSubscription?.unsubscribe();
            broadcasterUpdatingSubscription?.unsubscribe();
            broadcasterDeletingSubscription?.unsubscribe();
        };
    }, [worldId]);

    return (
        <ExpandBarDiv opened={opened}>
            <ListContainer>
                {
                    broadcasters.map(broadcaster => {
                        const update = (newbroadcaster: Partial<Server.Broadcaster>) => {setBroadcasters(broadcasters => broadcasters.map(broadcaster_ => broadcaster_.id === broadcaster.id ? {...broadcaster_, ...newbroadcaster} : broadcaster_));};
                        return (
                            <ListItem broadcaster={broadcaster} key={broadcaster.id} update={update}/>
                        );
                    })
                }
            </ListContainer>
            <AddContainer>
                <AddButton onClick={onAddButtonClick}/>
            </AddContainer>
        </ExpandBarDiv>
    );
}


export default React.memo(BroadcasterEditorInner);



async function getGlobalBroadcasterCreatingObservable(apolloClient: ApolloClient<any>, worldId: string) {
    return await apolloClient.subscribe({
        query: gql`
            subscription GlobalBroadcasterCreating($worldId: String!) {
                globalBroadcasterCreating(worldId: $worldId) {
                    id
                    name
                }
            }
        `,
        variables: {
            worldId
        }
    }).map(result => result.data.globalBroadcasterCreating as Server.GlobalBroadcaster);
}

async function getGlobalBroadcasters(apolloClient: ApolloClient<any>, worldId: string) {
    const result = await apolloClient.query({
        query: gql`
            query World($id: String!) {
                World(id: $id) {
                    globalBroadcasters {
                        id,
                        name
                    }
                }
            }
        `,
        variables: {
            id: worldId
        }
    });
    
    return result.data.World.globalBroadcasters as Server.GlobalBroadcaster[];
}


async function createGlobalBroadcaster(apolloClient: ApolloClient<any>, worldId: string, name: string) {
    await apolloClient.mutate({
        mutation: gql`
            mutation CreateGlobalBroadcaster($worldId: String!, $broadcaster: BroadcasterInput!) {
                createGlobalBroadcaster(worldId: $worldId, broadcaster: $broadcaster) {
                    id
                }
            }
        `,
        variables: {
            worldId,
            broadcaster: {
                name
            }
        }
    });
}

async function updateBroadcaster(apolloClient: ApolloClient<any>, id: number, name: string) {
    await apolloClient.mutate({
        mutation: gql`
            mutation UpdateBroadcaster($broadcaster: BroadcasterInput!, $id: Int!) {
                updateBroadcaster(broadcaster: $broadcaster, id: $id) {
                    id
                }
            }
        `,
        variables: {
            id,
            broadcaster: {
                name
            }
        }
    });
}

async function deleteBroadcaster(apolloClient: ApolloClient<any>, id: number) {
    await apolloClient.mutate({
        mutation: gql`
            mutation DeleteBroadcaster($id: Int!) {
                deleteBroadcaster(id: $id)
            }
        `,
        variables: {
            id
        }
    });
}

async function getBroadcasterUpdatingObservable(apolloClient: ApolloClient<any>, worldId: string) {
    return await apolloClient.subscribe({
        query: gql`
            subscription BroadcasterUpdating($worldId: String!) {
                broadcasterUpdating(worldId: $worldId) {
                    id
                    name
                }
            }
        `,
        variables: {
            worldId
        }
    }).map(result => result.data.broadcasterUpdating as Server.Broadcaster);
}

async function getBroadcasterDeletingObservable(apolloClient: ApolloClient<any>, worldId: string) {
    return await apolloClient.subscribe({
        query: gql`
            subscription BroadcasterDeleting($worldId: String!) {
                broadcasterDeleting(worldId: $worldId)
            }
        `,
        variables: {
            worldId
        }
    }).map(result => result.data.broadcasterDeleting as number);
}