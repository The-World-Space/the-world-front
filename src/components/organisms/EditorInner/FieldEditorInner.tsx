import { ApolloClient, gql, useApolloClient } from "@apollo/client";
import React, { ChangeEventHandler, FocusEventHandler, useEffect, useState, useContext, useCallback} from "react";
import styled from "styled-components";
import { WorldEditorContext } from "../../../context/contexts";
import { globalApolloClient } from "../../../game/connect/gql";
import { Server } from "../../../game/connect/types";
import PlusIcon from "../../atoms/PlusIcon.svg";

const SIDE_BAR_WIDTH = 130/* px */;
const EXTENDS_BAR_WIDTH = 464/* px */;

export const FANCY_SCROLLBAR_CSS = `
::-webkit-scrollbar {
    width: 14px;
    padding: 10px 1px 10px 1px;
}
::-webkit-scrollbar-thumb {
    width: 2px;
    border-radius: 1px;
    background-color: #2E2E2E60;

    background-clip: padding-box;
    border: 6px solid transparent;
    border-bottom: 12px solid transparent;
}
::-webkit-scrollbar-track {
    display: none;
}

scrollbar-color: #2E2E2E60 #00000000; // for FF
scrollbar-width: thin; // for FF
`;

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
    min-height: 100px;
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

const ListItemBody = styled.textarea`
    margin-top: 10px;

    background: #FFFFFE;
    border-radius: 17px;
    display: flex;
    width: 100%;
    height: 100%;

    border-style: none;
    min-height: 40px;
    box-sizing: border-box;
    padding: 14px 18px;

    resize: none;
    flex: 1;
    
    ${FANCY_SCROLLBAR_CSS}
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



function ListItem({ field, update }: { field: Server.GlobalField, update: (field: Partial<Server.Field>) => void }) {

    const apolloClient = useApolloClient();

    const onNameChange: ChangeEventHandler<HTMLInputElement> = e => {
        update({ name: e.target.value });
    };
    const onValueChange: ChangeEventHandler<HTMLTextAreaElement> = e => {
        update({ value: e.target.value });
    };

    const onNameBlur: FocusEventHandler<HTMLInputElement> = () => {
        updateField(apolloClient, field.id, field.name, field.value);
        game?.inputHandler.startHandleEvents();
    };
    const onValueBlur: FocusEventHandler<HTMLTextAreaElement> = () => {
        updateField(apolloClient, field.id, field.name, field.value);
        game?.inputHandler.startHandleEvents();
    };
    const onClickDeleteButton = () => {
        deleteField(apolloClient, field.id);
    };

    const {game} = useContext(WorldEditorContext);

    const onFocus = useCallback(() => {
        game?.inputHandler.stopHandleEvents();
    }, [game]);

    return (
        <StyledListItem>
            <ListItemTitleBox>
                <ListItemTitle value={field.name} onChange={onNameChange} onFocus={onFocus} onBlur={onNameBlur} placeholder="Field Name"/>
                <DeleteButton onClick={onClickDeleteButton}>X</DeleteButton>
            </ListItemTitleBox>
            <ListItemBody value={field.value} onChange={onValueChange} onFocus={onFocus} onBlur={onValueBlur} placeholder="Field Value"/>
        </StyledListItem>
    );
}

function FieldEditorInner({ worldId, opened }: PropsType) {
    const [fields, setFields] = useState<Server.GlobalField[]>([]);

    const onAddButtonClick = () => {
        createGlobalField(globalApolloClient, worldId, "", "");
    };

    useEffect(() => {
        (async () => {
            const fields = await getGlobalFields(globalApolloClient, worldId);
            setFields(fields);
        })();
    }, [worldId]);

    useEffect(() => {
        let fieldCreatingSubscription: undefined | ZenObservable.Subscription;
        let fieldUpdatingSubscription: undefined | ZenObservable.Subscription;
        let fieldDeletingSubscription: undefined | ZenObservable.Subscription;
        (async () => {
            fieldCreatingSubscription =
                (await getGlobalFieldCreatingObservable(globalApolloClient, worldId))
                    .subscribe(field => {
                        setFields(fields => [...fields, field]);
                    });
            fieldUpdatingSubscription = 
                (await getFieldUpdatingObservable(globalApolloClient, worldId))
                    .subscribe(field => {
                        setFields(fields => fields.map(field_ => field_.id === field.id ? { ...field_, ...field } : field_));
                    });
            fieldDeletingSubscription =
                (await getFieldDeletingObservable(globalApolloClient, worldId))
                    .subscribe(id => {
                        setFields(fields => fields.filter(field => field.id !== id));
                    });
        })();

        return () => {
            fieldCreatingSubscription?.unsubscribe();
            fieldUpdatingSubscription?.unsubscribe();
            fieldDeletingSubscription?.unsubscribe();
        };
    }, [worldId]);

    return (
        <ExpandBarDiv opened={opened}>
            <ListContainer>
                {
                    fields.map(field => {
                        const update = (newField: Partial<Server.Field>) => {setFields(fields => fields.map(field_ => field_.id === field.id ? {...field_, ...newField} : field_));};
                        return (
                            <ListItem field={field} key={field.id} update={update}/>
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

export default React.memo(FieldEditorInner);



export function useGlobalFields(apolloClient: ApolloClient<any>, worldId: string): Server.GlobalField[] {
    const [fields, setFields] = useState<Server.GlobalField[]>([]);

    useEffect(() => {
        (async () => {
            const fields = await getGlobalFields(apolloClient, worldId);
            setFields(fields);
        })();
    }, [worldId, apolloClient]);

    useEffect(() => {
        let fieldCreatingSubscription: undefined | ZenObservable.Subscription;
        let fieldUpdatingSubscription: undefined | ZenObservable.Subscription;
        let fieldDeletingSubscription: undefined | ZenObservable.Subscription;
        (async () => {
            fieldCreatingSubscription =
                (await getGlobalFieldCreatingObservable(apolloClient, worldId))
                    .subscribe(field => {
                        setFields(fields => [...fields, field]);
                    });
            fieldUpdatingSubscription = 
                (await getFieldUpdatingObservable(apolloClient, worldId))
                    .subscribe(field => {
                        setFields(fields => fields.map(field_ => field_.id === field.id ? { ...field_, ...field } : field_));
                    });
            fieldDeletingSubscription =
                (await getFieldDeletingObservable(apolloClient, worldId))
                    .subscribe(id => {
                        setFields(fields => fields.filter(field => field.id !== id));
                    });
        })();

        return () => {
            fieldCreatingSubscription?.unsubscribe();
            fieldUpdatingSubscription?.unsubscribe();
            fieldDeletingSubscription?.unsubscribe();
        };
    }, [worldId, apolloClient]);

    return fields;
}

async function getGlobalFields(apolloClient: ApolloClient<any>, worldId: string): Promise<Server.GlobalField[]> {
    const result = await apolloClient.query({
        query: gql`
            query World($id: String!) {
                World(id: $id) {
                    globalFields {
                        id,
                        name,
                        value
                    }
                }
            }
        `,
        variables: {
            id: worldId
        }
    });
    
    return result.data.World.globalFields as Server.GlobalField[];
}

async function createGlobalField(apolloClient: ApolloClient<any>, worldId: string, name: string, value: string): Promise<void> {
    await apolloClient.mutate({
        mutation: gql`
            mutation CreateGlobalField($worldId: String!, $field: FieldInput!) {
                createGlobalField(worldId: $worldId, field: $field) {
                    id
                }
            }
        `,
        variables: {
            worldId,
            field: {
                name,
                value
            }
        }
    });
}

async function updateField(apolloClient: ApolloClient<any>, id: number, name: string, value: string) {
    await apolloClient.mutate({
        mutation: gql`
            mutation UpdateField($field: FieldInput!, $id: Int!) {
                updateField(field: $field, id: $id) {
                    id
                }
            }
        `,
        variables: {
            id,
            field: {
                name,
                value
            }
        }
    });
}

async function deleteField(apolloClient: ApolloClient<any>, id: number) {
    await apolloClient.mutate({
        mutation: gql`
            mutation DeleteField($id: Int!) {
                deleteField(id: $id)
            }
        `,
        variables: {
            id
        }
    });
}

export async function getGlobalFieldCreatingObservable(apolloClient: ApolloClient<any>, worldId: string) {
    return await apolloClient.subscribe({
        query: gql`
            subscription GlobalFieldCreating($worldId: String!) {
                globalFieldCreating(worldId: $worldId) {
                    id
                    name
                    value
                }
            }
        `,
        variables: {
            worldId
        }
    }).map(result => result.data.globalFieldCreating as Server.GlobalField);
}

export async function getFieldUpdatingObservable(apolloClient: ApolloClient<any>, worldId: string) {
    return await apolloClient.subscribe({
        query: gql`
            subscription FieldUpdating($worldId: String!) {
                fieldUpdating(worldId: $worldId) {
                    id
                    name
                    value
                }
            }
        `,
        variables: {
            worldId
        }
    }).map(result => result.data.fieldUpdating as Server.Field);
}

export async function getFieldDeletingObservable(apolloClient: ApolloClient<any>, worldId: string) {
    return await apolloClient.subscribe({
        query: gql`
            subscription FieldDeleting($worldId: String!) {
                fieldDeleting(worldId: $worldId)
            }
        `,
        variables: {
            worldId
        }
    }).map(result => result.data.fieldDeleting as number);
}