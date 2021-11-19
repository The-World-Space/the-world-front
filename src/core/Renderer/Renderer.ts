import { Character } from "../Character/Character";
import { Effect } from "../Map/Objects/Effect";
import { Floor } from "../Map/Objects/Floor";
import { Wall } from "../Map/Objects/Wall";
import { Point } from "../types/Base";
import { GameObject } from "../types/GameObject";
import { DomShape } from "../types/Shape/DomShape";
import { ImageShape } from "../types/Shape/ImageShape";
import { World } from "../World/World";


export const PIXELSIZE = 32;
export const MOVING_MS = 100;


export class Renderer {
    private _world: World;

    private _wrapperDom!: HTMLDivElement;

    private _iframeEffectDom!: HTMLDivElement;
    private _imageEffectDom!: HTMLCanvasElement;

    private _wallDom!: HTMLDivElement;

    private _iframeFloorDom!: HTMLDivElement;
    private _imageFloorDom!: HTMLCanvasElement;

    private _ObjectDomMap: Map<GameObject, HTMLElement | HTMLImageElement>;


    constructor(world: World, changeAbleList: GameObject[] = []) {
        this._world = world;
        this._ObjectDomMap = new Map();

        this._domSetup();
        this._drawAll();
    }

    private _domSetup() {
        const fullsize = (dom: HTMLElement) => {
            dom.style.position = 'absolute';
            dom.style.left = '0px';
            dom.style.top = '0px';

            dom.style.width = '100%';
            dom.style.height = '100%';
        }

        const mapSize = (dom: HTMLElement) => {
            dom.style.width = `${this._world.getMap().getSize().width * PIXELSIZE}px`;
            dom.style.height = `${this._world.getMap().getSize().height * PIXELSIZE}px`;
        }

        const _changeWidthToMapSizeCanvas = (dom: HTMLCanvasElement) => {
            dom.width = this._world.getMap().getSize().width * PIXELSIZE;
            dom.height = this._world.getMap().getSize().height * PIXELSIZE;
        }
        const _resetCanvas = () => {
            _changeWidthToMapSizeCanvas(this._imageEffectDom);
            _changeWidthToMapSizeCanvas(this._imageFloorDom);
        }


        this._wrapperDom = document.createElement('div');
        this._wrapperDom.style.overflow = 'hidden'

        this._iframeEffectDom = document.createElement('div');
        this._imageEffectDom = document.createElement('canvas');
        this._wallDom = document.createElement('div');
        this._iframeFloorDom = document.createElement('div');
        this._imageFloorDom = document.createElement('canvas');

        this._iframeEffectDom.style.zIndex = '5';
        this._imageEffectDom.style.zIndex = '4';
        this._wallDom.style.zIndex = '3';
        this._iframeFloorDom.style.zIndex = '2';
        this._imageFloorDom.style.zIndex = '1';

        this.enableWorldTransition();

        this._imageEffectDom.style.pointerEvents = 'none';
        this._imageFloorDom.style.pointerEvents = 'none';

        this._wrapperDom.appendChild(this._iframeEffectDom);
        this._wrapperDom.appendChild(this._imageEffectDom);
        this._wrapperDom.appendChild(this._wallDom);
        this._wrapperDom.appendChild(this._iframeFloorDom);
        this._wrapperDom.appendChild(this._imageFloorDom);

        fullsize(this._wrapperDom);
        fullsize(this._iframeEffectDom);
        fullsize(this._imageEffectDom);
        fullsize(this._wallDom);
        fullsize(this._iframeFloorDom);
        fullsize(this._imageFloorDom);

        mapSize(this._imageEffectDom);
        mapSize(this._imageFloorDom);
        
        this._iframeEffectDom.style.width = '0px';
        this._iframeEffectDom.style.height = '0px';
        this._wallDom.style.width = '0px';
        this._wallDom.style.height = '0px';
        this._iframeFloorDom.style.width = '0px';
        this._iframeFloorDom.style.height = '0px';

        _resetCanvas();
    }

    enableWorldTransition() {
        this._iframeEffectDom.style.transition = `all ${MOVING_MS}ms`;
        this._iframeEffectDom.style.transitionTimingFunction = 'linear';
        this._imageEffectDom.style.transition = `all ${MOVING_MS}ms`;
        this._imageEffectDom.style.transitionTimingFunction = 'linear';
        this._wallDom.style.transition = `all ${MOVING_MS}ms`;
        this._wallDom.style.transitionTimingFunction = 'linear';
        this._iframeFloorDom.style.transition = `all ${MOVING_MS}ms`;
        this._iframeFloorDom.style.transitionTimingFunction = 'linear';
        this._imageFloorDom.style.transition = `all ${MOVING_MS}ms`;
        this._imageFloorDom.style.transitionTimingFunction = 'linear';
    }

    disableWorldTransition() {
        this._iframeEffectDom.style.transition = 'none';
        this._imageEffectDom.style.transition = 'none';
        this._wallDom.style.transition = 'none';
        this._iframeFloorDom.style.transition = 'none';
        this._imageFloorDom.style.transition = 'none';
    }


    static styleDom<T extends HTMLElement>(dom: T, gameObject: GameObject, isLeftBottomPos = false) {
        const shape = gameObject.getShape();
        const size = shape.getSize();
        const pos = gameObject.getPosition();

        dom.style.imageRendering = 'pixelated';
        dom.style.width = `${size.width * PIXELSIZE}px`;
        dom.style.height = `${size.height * PIXELSIZE}px`;

        dom.style.position = 'absolute';
        dom.style.left = `${pos.x * PIXELSIZE}px`;
        dom.style.top = `${(isLeftBottomPos ? pos.y - size.height + 1 : pos.y) * PIXELSIZE}px`;

        return dom;
    }


    private _drawAll() {
        this.drawEffects();
        this._drawWalls();
        this.drawFloors();
    }


    drawFlatObject(object: GameObject, iframeDom: HTMLDivElement, context: CanvasRenderingContext2D) {
        if(context) context.imageSmoothingEnabled = false;

        const drawToDom = (shape: DomShape<any>, object: GameObject) => {
            const dom = Renderer.styleDom(shape.getDom(), object, false);
            iframeDom.appendChild(dom);

            this._ObjectDomMap.set(object, dom);
        }

        const drawToCanvas = (shape: ImageShape, object: GameObject) => {
            const size = shape.getSize();
            const pos = object.getPosition();
            const [x, y] = [pos.x * PIXELSIZE, pos.y * PIXELSIZE];
            const [width, height] = [size.width * PIXELSIZE, size.height * PIXELSIZE];

            const img = new Image();
            img.src = shape.getImageUrl();
            img.onload = () =>
                context.drawImage(img, x, y, width, height);
        }


        const shape = object.getShape();

        if (shape instanceof DomShape) {
            drawToDom(shape, object);
        }
        else if (shape instanceof ImageShape) {
            drawToCanvas(shape, object);
        }
        else {
            throw new Error('Unsupported shape');
        }
    }


    drawFlatObjects(objects: GameObject[], iframeDom: HTMLDivElement, context: CanvasRenderingContext2D) {
        for (const object of objects) {
            this.drawFlatObject(object, iframeDom, context);
        }
    }


    drawUnflatObject(object: GameObject) {
        const isCharacter = object instanceof Character;

        const applyDom = (dom: HTMLElement, object: GameObject) => {
            this._wallDom.appendChild(dom);
            this._ObjectDomMap.set(object, dom);
            dom.style.transition = `all ${MOVING_MS}ms`;
            dom.style.transitionTimingFunction = 'linear';
        }

        const drawAsIframe = (shape: DomShape<any>, object: GameObject) => {
            const dom = Renderer.styleDom(shape.getDom(), object, true);
            dom.style.zIndex = `${2 * object.getPosition().y - (isCharacter ? 1 : 0)}`;

            applyDom(dom, object);
        }

        const drawAsImage = (shape: ImageShape, object: GameObject) => {
            const img = Renderer.styleDom(document.createElement('img'), object, true);
            img.src = shape.getImageUrl();
            img.style.zIndex = `${2 * object.getPosition().y - (isCharacter ? 1 : 0)}`;

            applyDom(img, object);
        }

        const shape = object.getShape();

        if (shape instanceof DomShape) {
            drawAsIframe(shape, object);
        }
        else if (shape instanceof ImageShape) {
            drawAsImage(shape, object);
        }
        else {
            throw new Error('Unsupported shape');
        }
    }


    drawUnflatObjects(objects: GameObject[]) {
        for (const object of objects) {
            this.drawUnflatObject(object);
        }
    }



    updateOne(object: GameObject, dom?: HTMLElement | HTMLImageElement) {
        dom = dom || this._ObjectDomMap.get(object);
        
        const isCharacter = object instanceof Character;
        const isUnflat = object instanceof Wall || object instanceof Character
        
        const updateAsIframe = (shape: DomShape<any>, object: GameObject, dom: HTMLElement) => {
            Renderer.styleDom(dom, object, isUnflat);
            dom.style.zIndex = `${2 * object.getPosition().y - (isCharacter ? 1 : 0)}`;
        }
        
        const updateAsImage = (shape: ImageShape, object: GameObject, dom: HTMLImageElement) => {
            Renderer.styleDom(dom, object, isUnflat);
            if (dom.src !== new URL(shape.getImageUrl(), document.baseURI).href) {
                dom.src = shape.getImageUrl();
            }
            dom.style.zIndex = `${2 * object.getPosition().y - (isCharacter ? 1 : 0)}`;
        }

        if (dom) {
            const shape = object.getShape();

            if (shape instanceof DomShape) {
                updateAsIframe(shape, object, dom);
            }
            else if (shape instanceof ImageShape) {
                updateAsImage(shape, object, dom as HTMLImageElement);
            }
            else {
                throw new Error('Unsupported shape');
            }
        }
        else {
            throw new Error('Object not found');
        }
    }


    removeOne(object: GameObject, dom?: HTMLElement | HTMLImageElement) {
        dom = dom || this._ObjectDomMap.get(object);
        this._ObjectDomMap.delete(object);

        if (dom) {
            this._ObjectDomMap.delete(object);
            dom.parentElement?.removeChild(dom);
        }
        else {
            throw new Error('Object not found');
        }
    }



    drawEffect(effect: Effect) {
        const context = this._imageEffectDom.getContext('2d')!;

        this.drawFlatObject(effect, this._iframeEffectDom, context);
    }

    drawFloor(floor: Floor) {
        const context = this._imageFloorDom.getContext('2d')!;

        this.drawFlatObject(floor, this._iframeFloorDom, context);
    }

    drawEffects() {
        const effects = this._world.getMap().getEffects();

        effects.forEach(effect => this.drawEffect(effect));
    }


    drawFloors() {
        const floors = this._world.getMap().getFloors();

        floors.forEach(floor => this.drawFloor(floor));
    }


    _drawWalls() {
        this.drawUnflatObjects(this._world.getMap().getWalls());
    }

    update() {
        for (const object of this._ObjectDomMap.keys()) {
            this.updateOne(object);
        }
    }

    getWrapperDom() {
        return this._wrapperDom;
    }


    setLeft(px: number) {
        this._iframeEffectDom.style.left = `${px}px`;
        this._imageEffectDom.style.left = `${px}px`;
        this._wallDom.style.left = `${px}px`;
        this._iframeFloorDom.style.left = `${px}px`;
        this._imageFloorDom.style.left = `${px}px`;
    }

    setTop(px: number) {
        this._iframeEffectDom.style.top = `${px}px`;
        this._imageEffectDom.style.top = `${px}px`;
        this._wallDom.style.top = `${px}px`;
        this._iframeFloorDom.style.top = `${px}px`;
        this._imageFloorDom.style.top = `${px}px`;
    }

    
    setCenter(center: Point) {
        this.setLeft(this._wrapperDom.offsetWidth / 2 - center.x * PIXELSIZE);
        this.setTop(this._wrapperDom.offsetHeight / 2 - center.y * PIXELSIZE);
    }
}