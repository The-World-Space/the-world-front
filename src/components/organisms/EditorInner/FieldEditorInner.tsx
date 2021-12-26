import { ApolloClient, gql, useApolloClient } from "@apollo/client";
import React, { ChangeEventHandler, FocusEventHandler, useEffect, useState } from "react";
import styled from "styled-components";
import { globalApolloClient } from "../../../game/connect/gql";
import { Server } from "../../../game/connect/types";
import PlusIcon from "../../atoms/PlusIcon.svg";


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
`;

const ListContainer = styled.ol`
    display: flex;
    padding: 0px;
    margin: 0px;
    width: 100%;
    flex-direction: column;
    align-items: center;
`;

const StyledListItem = styled.li`
    background: #A69B97;
    border-radius: 23px;
    display: flex;
    width: 90%;
    min-height: 60px;
    margin-top: 20px;
    padding: 7px;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
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

    resize: vertical;
`;

const AddContainer = styled.div`
    margin-top: 20px;
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
    };
    const onValueBlur: FocusEventHandler<HTMLTextAreaElement> = () => {
        updateField(apolloClient, field.id, field.name, field.value);
    };

    return (
        <StyledListItem>
            <ListItemTitle value={field.name} onChange={onNameChange} onBlur={onNameBlur}/>
            <ListItemBody value={field.value} onChange={onValueChange} onBlur={onValueBlur}/>
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
        let fieldCreatingSubscription: null | ZenObservable.Subscription;
        let fieldUpdatingSubscription: null | ZenObservable.Subscription;
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
        })();

        return () => {
            fieldCreatingSubscription?.unsubscribe();
            fieldUpdatingSubscription?.unsubscribe();
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




async function getGlobalFields(apolloClient: ApolloClient<any>, worldId: string) {
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

async function createGlobalField(apolloClient: ApolloClient<any>, worldId: string, name: string, value: string) {
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

async function getGlobalFieldCreatingObservable(apolloClient: ApolloClient<any>, worldId: string) {
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

async function getFieldUpdatingObservable(apolloClient: ApolloClient<any>, worldId: string) {
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

// async function getGlobalFieldDeletingObservable(apolloClient: ApolloClient<any>, worldId: string) {
//     return await apolloClient.subscribe({
//         query: gql`
//             subscription GlobalFieldDeleting($worldId: String!) {
//                 globalFieldDeleting(worldId: $worldId)
//             }
//         `,
//         variables: {
//             worldId
//         }
//     }).map(result => result.data.globalFieldDeleting as number);
// }