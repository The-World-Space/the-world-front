import { ApolloClient, gql } from "@apollo/client";
import { Vector2 } from "three";
import { Component } from "../../engine/hierarchy_object/Component";
import { GridBrush } from "../input/GridBrush";
import { Tool, Tools } from "../WorldEditorConnector";

export class NetworkBrushManager extends Component {
    private _gridBrush: GridBrush | null = null;
    private _currentTool: Tool | null = null;
    private _apolloClient: ApolloClient<any> | null = null;
    private _worldId: string = "";

    public set gridBrush(val: GridBrush) {
        this._gridBrush = val;
    }

    public set apolloClient(val: ApolloClient<any>) {
        this._apolloClient = val;
    }
    
    public set worldId(val: string) {
        this._worldId = val;
    }
    
    public setCurrentTool(val: Tool): void {
        this._currentTool = val;
    }

    public awake(): void {
        if (!this._gridBrush) throw new Error("no grid brush");
        
        this._gridBrush.onDraw = this._onDraw.bind(this);
    }

    private async _onDraw(gridPos: Vector2) {
        if (!this._currentTool) return;

        try {
            if (this._currentTool instanceof Tools.Collider) {
                await this._updateCollider(gridPos.x, gridPos.y, true);   
            }
            else if (this._currentTool instanceof Tools.EraseCollider) {
                await this._updateCollider(gridPos.x, gridPos.y, false);
            }
            else if (this._currentTool instanceof Tools.ImageGameObject) {
                await this._updateImageGameObject(gridPos.x, gridPos.y);
            }
            else if (this._currentTool instanceof Tools.Tile) {
                await this._updateTile(gridPos.x, gridPos.y);
            }
            else if (this._currentTool instanceof Tools.EraseTile) {
                await this._deleteAtlasTile(gridPos.x, gridPos.y);
            }
            // else if (this._currentTool instanceof Tools.Eras) {
            //     await this._deleteObject(gridPos.x, gridPos.y);
            // }
            else if (this._currentTool instanceof Tools.IframeGameObject) {
                await this._createIframeGameObject(gridPos.x, gridPos.y);
            }
        } catch(e) {
            console.warn(e);
        }
    }

    private _updateCollider(x: number, y: number, isBlocked: boolean) {
        if (!this._worldId) throw new Error("no world id");
        if (!this._apolloClient) throw new Error("no apollo client");
        return this._apolloClient.mutate({
            mutation: gql`
                mutation CreateCollider($x: Int!, $y: Int!, $isBlocked: Boolean!, $worldId: String!) {
                    updateCollider(x: $x, y: $y, worldId: $worldId, collider:{
                        isBlocked: $isBlocked
                    }) {
                        isBlocked
                    }
                }
            `,
            variables: {
                x,
                y,
                isBlocked,
                worldId: this._worldId,
            }
        });
    }

    private _updateImageGameObject(x: number, y: number) {
        if (!this._worldId) throw new Error("no world id");
        if (!this._apolloClient) throw new Error("no apollo client");
        if (!(this._currentTool instanceof Tools.ImageGameObject)) throw new Error("tool is not image game object");
        const protoId = this._currentTool.imageInfo.id;
        return this._apolloClient.mutate({
            mutation: gql`
                mutation CreateImageGO($imageGOInput: ImageGameObjectInput!, $worldId: String!) {
                    createImageGameObject(imageGameObject: $imageGOInput, worldId: $worldId) {
                        id
                    }
                }
            `,
            variables: {
                imageGOInput: {
                    x,
                    y,
                    protoId,
                },
                worldId: this._worldId,
            }
        });
    }

    private _updateTile(x: number, y: number) {
        if (!this._worldId) throw new Error("no world id");
        if (!this._apolloClient) throw new Error("no apollo client");
        if (!(this._currentTool instanceof Tools.Tile)) throw new Error("tool is not tile");
        const atlasId = this._currentTool.tileInfo.atlas.id;
        const atlasIndex = this._currentTool.tileInfo.atlasIndex;
        const worldId = this._worldId;
        const type = this._currentTool.tileInfo.type;
        return this._apolloClient.mutate({
            mutation: gql`
                mutation updateAtlasTile($type: Int!, $x: Int!, $y: Int!, $worldId: String!, $atlasTile: AtlasTileInput!) {
                    updateAtlasTile(type: $type, x: $x, y: $y, worldId: $worldId, atlasTile:$atlasTile) {
                        x,
                        y,
                    }
                }
            `,
            variables: {
                type,
                x,
                y,
                worldId,
                atlasTile: {
                    atlasId,
                    atlasIndex,
                }
            }
        });
    }

    private _deleteAtlasTile(x: number, y: number) {
        if (!this._worldId) throw new Error("no world id");
        if (!this._apolloClient) throw new Error("no apollo client");
        if (!(this._currentTool instanceof Tools.EraseTile)) throw new Error("tool is not erase tile");
        return this._apolloClient.mutate({
            mutation: gql`
                mutation deleteAtlasTile($type: Int!, $x: Int!, $y: Int!, $worldId: String!) {
                    deleteAtlasTile(type: $type, x: $x, y: $y, worldId: $worldId)
                }
            `,
            variables: {
                type: this._currentTool.type,
                x,
                y,
                worldId: this._worldId,
            }
        });
    }

    // private _deleteObject(x: number, y: number) {
    //     if (!this._worldId) throw new Error("no world id");
    //     if (!this._apolloClient) throw new Error("no apollo client");
    //     return this._apolloClient.mutate({
    //         mutation: gql`
    //             mutation deleteGameObjectsAt($x: Int!, $y: Int!, $worldId: String!) {
    //                 deleteGameObjectsAt(x: $x, y: $y, worldId: $worldId)
    //             }
    //         `,
    //         variables: {
    //             x,
    //             y,
    //             worldId: this._worldId,
    //         }
    //     });
    // }
    

    private _createIframeGameObject(x: number, y: number) {
        if (!this._worldId) throw new Error("no world id");
        if (!this._apolloClient) throw new Error("no apollo client");
        if (!(this._currentTool instanceof Tools.IframeGameObject)) throw new Error("tool is not iframe game object");
        return this._apolloClient.mutate({
            mutation: gql`
                mutation createIframeGameObjectInstantly(
                    $x: Int!, 
                    $y: Int!, 
                    $protoInput: IframeGameObjectProtoInput!, 
                    $worldId: String! 
                ) {
                    createIframeGameObjectInstantly(x: $x, y: $y, iframeGameObjectProto: $protoInput, worldId: $worldId) {
                        id
                    }
                }
            `,
            variables: {
                x,
                y,
                worldId: this._worldId,
                protoInput: {
                    ...this._currentTool.iframeInfo,
                    colliders: [],
                },
            }
        });
    }


    // private _buildNetworkIframe(colliderInfo: Server.Collider): void {
    //     if (!this._worldGridColliderMap.ref) throw new Error("worldGridColliderMap is null");
        
    //     if (colliderInfo.isBlocked)
    //         this._worldGridColliderMap.ref.addCollider(colliderInfo.x, colliderInfo.y);
    //     else
    //         this._worldGridColliderMap.ref.removeCollider(colliderInfo.x, colliderInfo.y);
    // }
}
