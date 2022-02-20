import { Euler, MathUtils, Quaternion, Vector2, Vector3 } from "three";
import { 
    GridCollideMap,
    SpriteInstance,
    SpriteStaticInstancer,
    CssSpriteRenderer,
    CssIframeRenderer,
    ZaxisSorter,
    GameObjectBuilder,
    Prefab,
    PrefabRef
 } from "the-world-engine";

export class InstancedObjectsPrefab extends Prefab {
    private _gridCollideMap: PrefabRef<GridCollideMap> = new PrefabRef();

    public getGridCollideMap(gridCollideMap: PrefabRef<GridCollideMap>): InstancedObjectsPrefab {
        this._gridCollideMap = gridCollideMap;
        return this;
    }

    public make(): GameObjectBuilder {
        const instantlater = this.engine.instantiater;

        return this.gameObjectBuilder
            .withChild(instantlater.buildGameObject("chairs")
                .withComponent(SpriteStaticInstancer, c => {
                    c.useZindexSorter = true;
                    c.pointerEvents = false;
                    c.imageSource = "/assets/object/chair/Chair1/chair(L&R).png";

                    const spriteSize = 18;
                    const xOffset = -3 * 16 - 8 - 2;
                    const yOffset = -4 * 18 - 8;
                    const xInterval = 2 * 16;
                    const yInterval = 2 * 16;

                    const instanceList: SpriteInstance[] = [];
                    for (let i = 0; i < 5; i++) {
                        for (let j = 0; j < 5; j++) {
                            instanceList.push(
                                new SpriteInstance(
                                    spriteSize,
                                    spriteSize,
                                    new Vector3(j * xInterval + xOffset, i * yInterval + yOffset, 0),
                                    undefined,
                                    undefined,
                                    new Vector2(0, 0.5)
                                )
                            );
                        }
                    }

                    c.setInstances(instanceList);
                }))

            .withChild(instantlater.buildGameObject("desks")
                .withComponent(SpriteStaticInstancer, c => {
                    c.useZindexSorter = true;
                    c.pointerEvents = false;
                    c.imageSource = "/assets/object/desk/common desk/desk1/Desk(R&L).png";

                    const spriteSize = 18;
                    const xOffset = -3 * 16 - 8 + 2;
                    const yOffset = -4 * 18 - 8;
                    const xInterval = 2 * 16;
                    const yInterval = 2 * 16;

                    const instanceList: SpriteInstance[] = [];
                    for (let i = 0; i < 5; i++) {
                        for (let j = 0; j < 5; j++) {
                            instanceList.push(
                                new SpriteInstance(
                                    spriteSize,
                                    spriteSize,
                                    new Vector3(j * xInterval + xOffset, i * yInterval + yOffset, 0),
                                    undefined,
                                    undefined,
                                    new Vector2(0, 0.5)
                                )
                            );
                        }
                    }

                    c.setInstances(instanceList);
                }))

            .withChild(instantlater.buildGameObject("lockers")
                .withComponent(SpriteStaticInstancer, c => {
                    c.useZindexSorter = true;
                    c.pointerEvents = false;
                    c.imageSource = "/assets/object/locker/Locker(L&R).png";

                    const spriteXsize = 40;
                    const spriteYsize = 64;

                    const instanceList: SpriteInstance[] = [
                        new SpriteInstance(
                            spriteXsize, spriteYsize,
                            new Vector3(-6 * 16 - 8, 1 * 16 + 2), undefined, undefined,
                            new Vector2(0, 0.5)
                        ),
                        new SpriteInstance(
                            spriteXsize, spriteYsize,
                            new Vector3(-6 * 16 - 8, -1 * 16 - 7), undefined, undefined,
                            new Vector2(0, 0.5)
                        ),
                        new SpriteInstance(
                            spriteXsize, spriteYsize,
                            new Vector3(-6 * 16 - 8, -4 * 16), undefined, undefined,
                            new Vector2(0, 0.5)
                        ),
                    ]
                    c.setInstances(instanceList);
                }))
                
            .withChild(instantlater.buildGameObject("trashcan", new Vector3(-6 * 16 - 8, -4 * 16, 0))
                .withComponent(CssSpriteRenderer, c => {
                    c.asyncSetImagePath("/assets/object/recycle bin/Recycle Bin(R&L).png");
                    c.imageWidth = 18;
                    c.imageHeight = 18;
                    c.centerOffset = new Vector2(0, 0.5);
                    c.pointerEvents = false;
                })
                .withComponent(ZaxisSorter))
            
            .withChild(instantlater.buildGameObject("centerdesk", new Vector3(7 * 16 - 8, -1 * 16, 0))
                .withComponent(CssSpriteRenderer, c => {
                    c.asyncSetImagePath("/assets/object/shoe rack/Shoe Rack(L&R).png");
                    c.imageWidth = 30;
                    c.imageHeight = 25;
                    c.centerOffset = new Vector2(0, 0.5);
                    c.pointerEvents = false;
                })
                .withComponent(ZaxisSorter))
            
            .withChild(instantlater.buildGameObject("tv", new Vector3(7 * 16 + 2, 7 * 16 + 10, 0))
                .withComponent(CssSpriteRenderer, c => {
                    c.asyncSetImagePath("/assets/object/tv/tv.png");
                    c.imageWidth = 40;
                    c.imageHeight = 0;
                    c.imageFlipX = true;
                    c.centerOffset = new Vector2(0, -0.5);
                    c.pointerEvents = false;
                })
                .withComponent(ZaxisSorter))
                
            .withChild(instantlater.buildGameObject("colidemap", new Vector3(8, 8))
                .withComponent(GridCollideMap, c => {
                    for (let i = 0; i < 5; i++) {
                        for (let j = 0; j < 5; j++) {
                            c.addCollider(j * 2 - 4, i * 2 - 5);
                        }
                    }
                    for (let i = -4; i < 5; i++) {
                        c.addCollider(-7, i);
                    }
                    c.addCollider(6, -1);
                })
                .getComponent(GridCollideMap, this._gridCollideMap ?? { ref: null }))

            .withChild(instantlater.buildGameObject("iframe", new Vector3(7 * 16 + 1, 5 * 16 + 7, 0),
                new Quaternion().setFromEuler(new Euler(MathUtils.degToRad(15), MathUtils.degToRad(-45), 0)))
                .withComponent(CssIframeRenderer, c => {
                    c.iframeSource = "https://www.youtube.com/embed/_6u84iKQxUU";
                    c.width = 36;
                    c.height = 18;
                    c.viewScale = 0.1;
                    c.centerOffset = new Vector2(0, 0.5);
                })
                .withComponent(ZaxisSorter));
    }
}
