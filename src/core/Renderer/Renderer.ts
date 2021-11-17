import { Character } from "../Character/Character";
import { Wall } from "../Map/Objects/Wall";
import { GameObject } from "../types/GameObject";
import { DomShape } from "../types/Shape/DomShape";
import { ImageShape } from "../types/Shape/ImageShape";
import { World } from "../World/World";


const PIXELSIZE = 32;


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
            dom.style.overflow = 'hidden';
        }

        const _changeWidthCanvas = (dom: HTMLCanvasElement) => {
            dom.width = window.innerWidth;
            dom.height = window.innerHeight;
        }
        const _resetCanvas = () => {
            _changeWidthCanvas(this._imageEffectDom);
            _changeWidthCanvas(this._imageFloorDom);
        }
        document.body.onresize = () =>{ 
            _resetCanvas();
            this._drawEffects();
            this._drawFloors();
        };


        this._wrapperDom = document.createElement('div');

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
        _resetCanvas();
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
        this._drawEffects();
        this._drawWalls();
        this._drawFloors();
    }


    drawFlatObject(object: GameObject, iframeDom: HTMLDivElement, context: CanvasRenderingContext2D) {
        if(context) context.imageSmoothingEnabled = false;

        const drawToDom = (shape: DomShape, object: GameObject) => {
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
        const applyDom = (dom: HTMLElement, object: GameObject) => {
            this._wallDom.appendChild(dom);
            this._ObjectDomMap.set(object, dom);
            dom.style.transition = 'all 0.1s';
            dom.style.transitionTimingFunction = 'linear';
        }

        const drawAsIframe = (shape: DomShape, object: GameObject) => {
            const dom = Renderer.styleDom(shape.getDom(), object, true);
            dom.style.zIndex = `${object.getPosition().y}`;

            applyDom(dom, object);
        }

        const drawAsImage = (shape: ImageShape, object: GameObject) => {
            const img = Renderer.styleDom(document.createElement('img'), object, true);
            img.src = shape.getImageUrl();
            img.style.zIndex = `${object.getPosition().y}`;

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
        
        const isUnflat = (obj: GameObject) => obj instanceof Wall || obj instanceof Character
        
        const updateAsIframe = (shape: DomShape, object: GameObject, dom: HTMLElement) => {
            Renderer.styleDom(dom, object, isUnflat(object));
            dom.style.zIndex = `${object.getPosition().y}`;
        }
        
        const updateAsImage = (shape: ImageShape, object: GameObject, dom: HTMLImageElement) => {
            Renderer.styleDom(dom, object, isUnflat(object));
            if (dom.src !== new URL(shape.getImageUrl(), document.baseURI).href) {
                dom.src = shape.getImageUrl();
            }
            dom.style.zIndex = `${object.getPosition().y}`;
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



    private _drawEffects() {
        const effects = this._world.getMap().getEffects();
        const iframeDom = this._iframeEffectDom;
        const context = this._imageEffectDom.getContext('2d')!;

        this.drawFlatObjects(effects, iframeDom, context);
    }


    private _drawFloors() {
        const floors = this._world.getMap().getFloors();
        const iframeDom = this._iframeFloorDom;
        const context = this._imageFloorDom.getContext('2d')!;

        this.drawFlatObjects(floors, iframeDom, context);
    }


    private _drawWalls() {
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
}