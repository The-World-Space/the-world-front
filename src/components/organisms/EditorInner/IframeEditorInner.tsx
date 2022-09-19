import { ApolloClient, gql, Observable, useApolloClient } from "@apollo/client";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Server } from "../../../game/connect/types";
import { useGameWSApolloClient } from "../../../pages/NetworkGamePage";
import { getBroadcasterDeletingObservable, getBroadcasterUpdatingObservable, useGlobalBroadcasters } from "./BroadcasterEditorInner";
import { FANCY_SCROLLBAR_CSS, getFieldDeletingObservable, getFieldUpdatingObservable, useGlobalFields } from "./FieldEditorInner";

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
    padding: 17px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.12);
`;

interface PropsType {
    worldId: string;
    opened: boolean;
}

function PortMappingListItem({ targetName, portId, isGlobal, remove }: { targetName: string, portId: string, isGlobal: boolean, remove: () => void }) {
    return (
        <li>
            <span>{portId}: {isGlobal ? "G|" : "L|"}{targetName}</span>
            <input style={{
                marginLeft: "5px",
                borderStyle: "none",
                borderRadius: "10px",
                background: "#D7CCC8"
            }} type="button" onClick={remove} value="X" />
        </li>
    );
}

const STYLED_UL = styled.ul`
    background-color: #FFFFFB;
    border-radius: 14px;

    list-style: disc;

    & > li {
        overflow-wrap: break-word;
    }
    font-family: Noto Sans;
`;

function PortMappingList<U extends Server.IframeFieldPortMapping | Server.IframeBroadcasterPortMapping>({
    remove,
    mappings,
    getName,
    isGlobal
}: {
    remove: (mappingId: number) => void,
    mappings: U[],
    isGlobal(id: number): boolean,
    getName(id: number): string
}) {
    return (
        <STYLED_UL>
            {
                mappings.map(mapping => {
                    const targetId = ("field" in mapping) ? mapping.field.id : mapping.broadcaster.id;
                    const isTargetGlobal = isGlobal(targetId);
                    const targetName = getName(targetId);

                    function remove_() {
                        remove(mapping.id);
                    }

                    return (
                        <PortMappingListItem key={mapping.id} isGlobal={isTargetGlobal} targetName={targetName} portId={mapping.portId} remove={remove_}/>
                    );
                })
            }
        </STYLED_UL>
    );
}

const PortIdInput = styled.input`
    width: 100%;
    height: 27px;
    line-height: 27px;

    box-sizing: border-box;

    border-radius: 14px;

    border: none;
    padding-left: 10px;

    margin: 6px 0px 6px 0px;
    font-family: Noto Sans;
`;

const AddArea = styled.div`
    width: 100%;
    height: 24px;
    line-height: 24px;

    box-sizing: border-box;

    display: flex;
`;

const Select = styled.select`
    flex: 1;
    height: 24px;
    line-height: 24px;

    border: none;
    outline: none;

    border-radius: 14px;

    padding-left: 10px;

    background-color: #D7CCC8;
    font-family: Noto Sans;
`;

const AddBtn = styled.input`
    width: 85px;
    height: 24px;
    line-height: 24px;

    box-sizing: border-box;
    border: none;
    outline: none;

    margin-left: 6px;

    border-radius: 44px;

    background-color: #D7CCC8;
`;

function PortMappingEditor<T extends Server.Broadcaster | Server.Field, U extends Server.IframeFieldPortMapping | Server.IframeBroadcasterPortMapping>({
    add,
    remove,
    globals,
    locals,
    mappings
}: {
    add: (id: number, portId: string) => void,
    remove: (mappingId: number) => void,
    globals: T[],
    locals: T[],
    mappings: U[]
}) {
    const [id, setId] = useState(globals[0]?.id ?? locals[0]?.id);
    const [portId, setPortId] = useState("");

    function addPortMapping() {
        const id_ = id ?? globals[0]?.id ?? locals[0]?.id;
        add(id_, portId);
    }

    function getName(id: number) {
        return locals.find(local => local.id === id)?.name || globals.find(global => global.id === id)?.name || "";
    }

    function isGlobal(id: number) {
        return globals.findIndex(global => global.id === id) !== -1;
    }

    return (
        <div>
            <PortMappingList remove={remove} mappings={mappings} getName={getName} isGlobal={isGlobal}/>
            <div>
                <PortIdInput type="text" onChange={e => setPortId(e.target.value)} value={portId} placeholder="Port ID"/>
            </div>
            <AddArea>
                <Select onChange={e => setId(parseInt(e.target.value))} value={id}>
                    {
                        [
                            ...globals.map(global => {
                                return (
                                    <option key={"G" + global.id} value={global.id}>G|{global.name}</option>
                                );
                            }),
                            ...locals.map(local => {
                                return (
                                    <option key={"L" + local.id} value={local.id}>L|{local.name}</option>
                                );
                            })
                        ]
                    }
                </Select>
                <AddBtn type="button" value="Add" onClick={addPortMapping}/>
            </AddArea>
        </div>
    );
}

const Title = styled.span`
    margin-left: auto;
    margin-right: auto;
    font-size: 20px;
    font-weight: bold;
    font-family: Noto Sans;
`;

const Subtitle = styled.span`
    font-size: 16px;
    margin: 12px 0px 3px 9px;
    font-weight: bold;
    font-family: Noto Sans;
`;

function ListItem({
    iframe,
    globalBroadcasters,
    globalFields
}: {
    iframe: Server.IframeGameObject,
    globalBroadcasters: Server.GlobalBroadcaster[],
    globalFields: Server.GlobalField[]
}) {
    const apolloClient = useApolloClient();

    function addFieldPortMapping(fieldId: number, portId: string) {
        createIframeFieldPortMapping(apolloClient, iframe.id, portId, fieldId);
    }
    function removeFieldPortMapping(mappingId: number) {
        deleteIframeFieldPortMapping(apolloClient, mappingId);
    }
    function addBroadcasterPortMapping(broadcasterId: number, portId: string) {
        createIframeBroadcasterPortMapping(apolloClient, iframe.id, portId, broadcasterId);
    }
    function removeBroadcasterPortMapping(mappingId: number) {
        deleteIframeBroadcasterPortMapping(apolloClient, mappingId);
    }

    //[PortMappingEditor, globalBroadcasters, globalFields, addFieldPortMapping, removeFieldPortMapping, addBroadcasterPortMapping, removeBroadcasterPortMapping];

    return (
        <StyledListItem>
            <Title>{iframe.id}</Title>
            <Subtitle>Field</Subtitle>
            <PortMappingEditor mappings={iframe.fieldPortMappings} add={addFieldPortMapping} remove={removeFieldPortMapping} globals={globalFields as Server.Field[]} locals={iframe.localFields}/>
            <Subtitle>Broadcaster</Subtitle>
            <PortMappingEditor mappings={iframe.broadcasterPortMappings} add={addBroadcasterPortMapping} remove={removeBroadcasterPortMapping} globals={globalBroadcasters as Server.Broadcaster[]} locals={iframe.localBroadcasters}/>
        </StyledListItem>
    );
}

function IframeEditorInner({ worldId, opened }: PropsType) {
    const apolloClient = useApolloClient();
    const globalApolloClient = useGameWSApolloClient();

    const globalFields = useGlobalFields(globalApolloClient, worldId);
    const globalBroadcasters = useGlobalBroadcasters(globalApolloClient, worldId);
    const [iframes, setIframes] = useState<Server.IframeGameObject[]>([]);

    useEffect(() => {
        (async () => {
            const world = await getWorldForIframeEdit(apolloClient, worldId);

            setIframes(world.iframes);
        })();
    }, [worldId, apolloClient]);

    // Portmapping events
    useEffect(() => {
        const subscriptions: ZenObservable.Subscription[] = [];
        
        (async () => {
            for(const iframe of iframes) {
                subscriptions.push(
                    (await getIframeFieldPortMappingObservable(globalApolloClient, iframe.id))
                        .subscribe(fieldPortMappings => {
                            setIframes(iframes => iframes.map(iframe_ => iframe_.id === iframe.id ? {...iframe_, fieldPortMappings } : iframe_));
                        }),
                    (await getIframeBroadcasterPortMappingObservable(globalApolloClient, iframe.id))
                        .subscribe(broadcasterPortMappings => {
                            setIframes(iframes => iframes.map(iframe_ => iframe_.id === iframe.id ? {...iframe_, broadcasterPortMappings } : iframe_));
                        })
                );
            }
        })();

        return () => {
            for(const subscription of subscriptions) {
                subscription.unsubscribe();
            }
        };
    }, [iframes, globalApolloClient]);

    // Iframe events
    useEffect(() => {
        const subscriptions: ZenObservable.Subscription[] = [];
        
        (async () => {
            subscriptions.push(
                (await getIframeCreatingObservable(globalApolloClient, worldId))
                    .subscribe(iframe => {
                        setIframes(iframes => [...iframes, iframe]);
                    }),
                (await getIframeDeletingObservable(globalApolloClient, worldId))
                    .subscribe(id => {
                        setIframes(iframes => iframes.filter(iframe => iframe.id !== id));
                    })
            );
        })();

        return () => {
            for(const subscription of subscriptions) {
                subscription.unsubscribe();
            }
        };
    }, [worldId, globalApolloClient]);

    // Local braodcaster events
    useEffect(() => {
        const subscriptions: ZenObservable.Subscription[] = [];
        
        (async () => {
            subscriptions.push(
                (await getLocalBroadcasterCreatingObservable(globalApolloClient, worldId))
                    .subscribe(localbroadCaster => {
                        setIframes(iframes => iframes.map(iframe => (
                            {...iframe, localBroadcasters: [...iframe.localBroadcasters, localbroadCaster]}
                        )));
                    }),
                (await getLocalFieldCreatingObservable(globalApolloClient, worldId))
                    .subscribe(localField => {
                        setIframes(iframes => iframes.map(iframe => (
                            {...iframe, localFields: [...iframe.localFields, localField]}
                        )));
                    })
            );
        })();

        return () => {
            for(const subscription of subscriptions) {
                subscription.unsubscribe();
            }
        };
    }, [worldId, globalApolloClient]);

    // Broadcaster / field events
    useEffect(() => {
        let broadcasterUpdatingSubscription: undefined | ZenObservable.Subscription;
        let broadcasterDeletingSubscription: undefined | ZenObservable.Subscription;
        let fieldUpdatingSubscription: undefined | ZenObservable.Subscription;
        let fieldDeletingSubscription: undefined | ZenObservable.Subscription;
        (async () => {
            broadcasterUpdatingSubscription = 
                (await getBroadcasterUpdatingObservable(globalApolloClient, worldId))
                    .subscribe(broadcaster => {
                        setIframes(
                            iframes.map(iframe => ({
                                ...iframe,
                                localBroadcasters: iframe.localBroadcasters.map(localBroadcaster => (
                                    localBroadcaster.id === broadcaster.id ? {...localBroadcaster, ...broadcaster} : localBroadcaster
                                ))
                            }))
                        );
                    });
            broadcasterDeletingSubscription =
                (await getBroadcasterDeletingObservable(globalApolloClient, worldId))
                    .subscribe(id => {
                        setIframes(
                            iframes.map(iframe => ({
                                ...iframe,
                                localBroadcasters: iframe.localBroadcasters.filter(localBroadcaster => (
                                    localBroadcaster.id !== id
                                ))
                            }))
                        );
                    });
            fieldUpdatingSubscription = 
                (await getFieldUpdatingObservable(globalApolloClient, worldId))
                    .subscribe(field => {
                        setIframes(
                            iframes.map(iframe => ({
                                ...iframe,
                                localFields: iframe.localFields.map(localField => (
                                    localField.id === field.id ? {...localField, ...field} : localField
                                ))
                            }))
                        );
                    });
            fieldDeletingSubscription =
                (await getFieldDeletingObservable(globalApolloClient, worldId))
                    .subscribe(id => {
                        setIframes(
                            iframes.map(iframe => ({
                                ...iframe,
                                localFields: iframe.localFields.filter(localField => (
                                    localField.id !== id
                                ))
                            }))
                        );
                    });
        })();

        return () => {
            broadcasterUpdatingSubscription?.unsubscribe();
            broadcasterDeletingSubscription?.unsubscribe();
            fieldUpdatingSubscription?.unsubscribe();
            fieldDeletingSubscription?.unsubscribe();
        };
    }, [worldId, iframes, globalApolloClient]);

    return (
        <ExpandBarDiv opened={opened}>
            <ListContainer>
                {
                    iframes.map(iframe => {
                        return (
                            <ListItem iframe={iframe} key={iframe.id} globalBroadcasters={globalBroadcasters} globalFields={globalFields}/>
                        );
                    })
                }
                <div style={{height: "80px"}}/>
            </ListContainer>
        </ExpandBarDiv>
    );
}

export default React.memo(IframeEditorInner);

// Port mapping
async function getIframeFieldPortMappingObservable(apolloClient: ApolloClient<any>, iframeId: number) {
    return await apolloClient.subscribe({
        query: gql`
        subscription IframeFieldPortMappingList($iframeId: Int!) {
            iframeFieldPortMappingList(iframeId: $iframeId) {
              id
              portId
              field {
                id
              }
            }
          }
        `,
        variables: {
            iframeId
        }
    }).map(result => result.data.iframeFieldPortMappingList as Server.IframeFieldPortMapping[]);
}

async function getIframeBroadcasterPortMappingObservable(apolloClient: ApolloClient<any>, iframeId: number) {
    return await apolloClient.subscribe({
        query: gql`
        subscription IframeBroadcasterPortMappingList($iframeId: Int!) {
            iframeBroadcasterPortMappingList(iframeId: $iframeId) {
              id
              portId
              broadcaster {
                id
              }
            }
          }
        `,
        variables: {
            iframeId
        }
    }).map(result => result.data.iframeBroadcasterPortMappingList as Server.IframeBroadcasterPortMapping[]);
}

// Iframe
async function getIframeCreatingObservable(apolloClient: ApolloClient<any>, worldId: string) {
    return await apolloClient.subscribe({
        query: gql`
        subscription IframeGameObjectCreating($worldId: String!) {
            iframeGameObjectCreating(worldId: $worldId) {
              id
              fieldPortMappings {
                id
              }
              broadcasterPortMappings {
                id
              }
              localFields {
                id
                name
              }
              localBroadcasters {
              id
              name
            }
            }
          }
        `,
        variables: {
            worldId
        }
    }).map(result => result.data.iframeGameObjectCreating as Server.IframeGameObject);
}

async function getIframeDeletingObservable(apolloClient: ApolloClient<any>, worldId: string) {
    return await apolloClient.subscribe({
        query: gql`
        subscription IframeGameObjectDeleting($worldId: String!) {
            iframeGameObjectDeleting(worldId: $worldId)
          }
        `,
        variables: {
            worldId
        }
    }).map(result => result.data.iframeGameObjectDeleting as number);
}

// Local Broadcaster & Field Creating event
export async function getLocalBroadcasterCreatingObservable(apolloClient: ApolloClient<any>, worldId: string): Promise<Observable<Server.LocalBroadcaster>> {
    return await apolloClient.subscribe({
        query: gql`
            subscription LocalBroadcasterCreating($worldId: String!) {
                localBroadcasterCreating(worldId: $worldId) {
                    id
                    name
                }
            }
        `,
        variables: {
            worldId
        }
    }).map(result => result.data.localBroadcasterCreating as Server.LocalBroadcaster);
}

export async function getLocalFieldCreatingObservable(apolloClient: ApolloClient<any>, worldId: string): Promise<Observable<Server.LocalField>> {
    return await apolloClient.subscribe({
        query: gql`
            subscription LocalFieldCreating($worldId: String!) {
                localFieldCreating(worldId: $worldId) {
                    id
                    name
                    value
                }
            }
        `,
        variables: {
            worldId
        }
    }).map(result => result.data.localFieldCreating as Server.LocalField);
}

async function getWorldForIframeEdit(apolloClient: ApolloClient<any>, worldId: string) {
    const result = await apolloClient.query({
        query: gql`
        query World($worldId: String!) {
            World(id:$worldId) {
              globalFields {
                name
                id
              }
              globalBroadcasters {
                name
                id
              }
              iframes {
                id
                fieldPortMappings {
                    portId
                    id
                  field {
                    id
                  }
                }
                broadcasterPortMappings {
                    portId
                    id
                  broadcaster {
                    id
                  }
                }
                localFields {
                  name
                  id
                }
                localBroadcasters {
                  name
                  id
                }
              }
            }
          }
        `,
        variables: {
            worldId
        }
    });

    return result.data.World as Server.World;
}

export async function createIframeFieldPortMapping(apolloClient: ApolloClient<any>, iframeId: number, portId: string, fieldId: number): Promise<void> {
    await apolloClient.mutate({
        mutation: gql`
        mutation CreateIframeFieldPortMapping($iframeId: Int!, $portId: String!, $fieldId: Int!){
            createIframeFieldPortMapping(iframeId: $iframeId, portId: $portId, fieldId: $fieldId) {
              id
            }
          }
        `,
        variables: {
            iframeId,
            portId,
            fieldId
        }
    });
}

async function deleteIframeFieldPortMapping(apolloClient: ApolloClient<any>, mappingId: number) {
    await apolloClient.mutate({
        mutation: gql`
        mutation DeleteIframeFieldPortMapping($id: Int!) {
            deleteIframeFieldPortMapping(id: $id)
          }
        `,
        variables: {
            id: mappingId
        }
    });
}

export async function createIframeBroadcasterPortMapping(apolloClient: ApolloClient<any>, iframeId: number, portId: string, broadcasterId: number): Promise<void> {
    await apolloClient.mutate({
        mutation: gql`
        mutation CreateIframeBroadcasterPortMapping($iframeId: Int!, $portId: String!, $broadcasterId: Int!){
            createIframeBroadcasterPortMapping(iframeId: $iframeId, portId: $portId, broadcasterId: $broadcasterId) {
              id
            }
          }
        `,
        variables: {
            iframeId,
            portId,
            broadcasterId
        }
    });
}

async function deleteIframeBroadcasterPortMapping(apolloClient: ApolloClient<any>, mappingId: number) {
    await apolloClient.mutate({
        mutation: gql`
        mutation DeleteIframeBroadcasterPortMapping($id: Int!) {
            deleteIframeBroadcasterPortMapping(id: $id)
          }
        `,
        variables: {
            id: mappingId
        }
    });
}
