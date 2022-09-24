import { ApolloClient, FetchResult, gql } from "@apollo/client";
import { Component } from "the-world-engine";
import { Vector2 } from "three/src/Three";
import { ProtoWebSocket } from "../../../proto/ProtoWebSocket";
import * as pb from "../../../proto/the_world";

import { GridBrush } from "../input/GridBrush";
import { Tool, Tools } from "../WorldEditorConnector";

export class NetworkBrushManager extends Component {
    private _gridBrush: GridBrush | null = null;
    private _currentTool: Tool | null = null;
    private _apolloClient: ApolloClient<any> | null = null;
    private _protoClient: ProtoWebSocket<pb.ServerEvent> | null = null;
    private _worldId = "";

    public set gridBrush(val: GridBrush) {
        this._gridBrush = val;
    }

    public set apolloClient(val: ApolloClient<any>) {
        this._apolloClient = val;
    }

    public set protoClient(val: ProtoWebSocket<pb.ServerEvent>) {
        this._protoClient = val;
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

    private async _onDraw(gridPos: Vector2): Promise<void> {
        if (!this._currentTool) return;

        try {
            if (this._currentTool instanceof Tools.Collider) {
                await this._updateCollider(gridPos.x, gridPos.y, true);   
            } else if (this._currentTool instanceof Tools.EraseCollider) {
                await this._updateCollider(gridPos.x, gridPos.y, false);
            } else if (this._currentTool instanceof Tools.ImageGameObject) {
                await this._updateImageGameObject(gridPos.x, gridPos.y);
            } else if (this._currentTool instanceof Tools.Tile) {
                await this._updateTile(gridPos.x, gridPos.y);
            } else if (this._currentTool instanceof Tools.EraseTile) {
                await this._deleteAtlasTile(gridPos.x, gridPos.y);
            } else if (this._currentTool instanceof Tools.EraseImageObject) {
                await this._deleteImageObject(gridPos.x, gridPos.y);
            } else if (this._currentTool instanceof Tools.EraseIframeObject) {
                await this._deleteIframeObject(gridPos.x, gridPos.y);
            } else if (this._currentTool instanceof Tools.IframeGameObject) {
                await this._createIframeGameObject(gridPos.x, gridPos.y);
            }
        } catch(e) {
            // console.warn(e);
        }
    }

    private _updateCollider(x: number, y: number, isBlocked: boolean): void {
        if (!this._worldId) throw new Error("no world id");
        if (!this._protoClient) throw new Error("no proto client");

        this._protoClient.send(new pb.ClientEvent({
            updateCollider: new pb.UpdateCollider({
                x,
                y,
                isBlocked
            })
        }));
    }

    private _updateImageGameObject(x: number, y: number): Promise<FetchResult> {
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
                    protoId
                },
                worldId: this._worldId
            }
        });
    }

    private _updateTile(x: number, y: number): void {
        if (!this._worldId) throw new Error("no world id");
        if (!this._protoClient) throw new Error("no proto client");
        if (!(this._currentTool instanceof Tools.Tile)) throw new Error("tool is not tile");
        const atlasId = this._currentTool.tileInfo.atlas.id;
        const atlasIndex = this._currentTool.tileInfo.atlasIndex;
        const type = this._currentTool.tileInfo.type;

        this._protoClient.send(new pb.ClientEvent({
            updateAtlasTile: new pb.UpdateAtlasTile({
                type: type,
                x: x,
                y: y,
                atlasId: atlasId,
                atlasIndex: atlasIndex
            })
        }));
    }

    private _deleteAtlasTile(x: number, y: number): void {
        if (!this._worldId) throw new Error("no world id");
        if (!this._protoClient) throw new Error("no proto client");
        if (!(this._currentTool instanceof Tools.EraseTile)) throw new Error("tool is not erase tile");

        this._protoClient.send(new pb.ClientEvent({
            deleteAtlasTile: new pb.DeleteAtlasTile({
                type: this._currentTool.type,
                x,
                y
            })
        }));
    }

    private _deleteIframeObject(x: number, y: number): void {
        if (!this._worldId) throw new Error("no world id");
        if (!this._protoClient) throw new Error("no proto client");
        if (!(this._currentTool instanceof Tools.EraseIframeObject)) throw new Error("tool is not erase iframe object");
        
        this._protoClient.send(new pb.ClientEvent({
            deleteIframeGameObjectsAt: new pb.DeleteIframeGameObjectsAt({
                x: x,
                y: y,
                type: this._currentTool.type
            })
        }));
    }


    private _deleteImageObject(x: number, y: number): Promise<FetchResult> {
        if (!this._worldId) throw new Error("no world id");
        if (!this._apolloClient) throw new Error("no apollo client");
        return this._apolloClient.mutate({
            mutation: gql`
                mutation deleteImageGameObjectsAt($x: Int!, $y: Int!, $worldId: String!) {
                    deleteImageGameObjectsAt(x: $x, y: $y, worldId: $worldId)
                }
            `,
            variables: {
                x,
                y,
                worldId: this._worldId
            }
        });
    }
    

    private _createIframeGameObject(x: number, y: number): void {
        if (!(this._currentTool instanceof Tools.IframeGameObject)) throw new Error("tool is not iframe game object");
        const tool = this._currentTool;
        const req = new Request(this._currentTool.iframeInfo.src);
        const sendIframe = () => {
            if (!this._worldId) throw new Error("no world id");
            if (!this._apolloClient) throw new Error("no apollo client");

            this._protoClient?.send(new pb.ClientEvent({
                createIframeGameObjectInstantly: new pb.CreateIframeGameObjectInstantly({
                    x: x,
                    y: y,
                    iframeGameObjectProto: new pb.CreateIframeGameObjectInstantly.IframeGameObjectProto({
                        name: tool.iframeInfo.name,
                        width: tool.iframeInfo.width,
                        height: tool.iframeInfo.height,
                        offsetX: tool.iframeInfo.offsetX,
                        offsetY: tool.iframeInfo.offsetY,
                        isPublic: tool.iframeInfo.isPublic,
                        type: tool.iframeInfo.type,
                        src: req.url
                    })
                })
            }));
        };
        return sendIframe();
    }
}
