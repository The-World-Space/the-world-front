import { Wall } from "../Map/Objects/Wall";
import { GameObject } from "../types/GameObject";
import { DomShape } from "../types/Shape/DomShape";
import { ImageShape } from "../types/Shape/ImageShape";
import { World } from "../World/World";


const PIXELSIZE = 32;


export class Renderer {
    _world: World;

    _wrapperDom!: HTMLDivElement;

    _iframeEffectDom!: HTMLDivElement;
    _imageEffectDom!: HTMLCanvasElement;

    _wallDom!: HTMLDivElement;

    _iframeFloorDom!: HTMLDivElement;
    _imageFloorDom!: HTMLCanvasElement;


    _changeableSet: Set<GameObject>;
    _changeableMap: Map<GameObject, HTMLElement | HTMLImageElement>;


    constructor(world: World, changeAbleList: GameObject[] = []) {
        this._world = world;
        this._changeableSet = new Set([...changeAbleList, ...world.getCharacters()]);
        this._changeableMap = new Map();

        this._domSetup();
        this._drawAll();
    }

    _domSetup() {
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


        this._wrapperDom = document.createElement('div');

        this._iframeEffectDom = document.createElement('div');
        this._imageEffectDom = document.createElement('canvas');

        this._wallDom = document.createElement('div');

        this._iframeFloorDom = document.createElement('div');
        this._imageFloorDom = document.createElement('canvas');

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

    static styleDom<T extends HTMLElement>(dom: T, gameObject: GameObject) {
        const shape = gameObject.getShape();
        const size = shape.getSize();
        const pos = gameObject.getPosition();

        dom.style.imageRendering = 'pixelated';
        dom.style.width = `${size.width * PIXELSIZE}px`;
        dom.style.height = `${size.height * PIXELSIZE}px`;

        dom.style.position = 'absolute';
        dom.style.left = `${pos.x * PIXELSIZE}px`;
        dom.style.top = `${pos.y * PIXELSIZE}px`;

        return dom;
    }


    _drawAll() {
        this._drawEffects();
        this._drawWalls();
        this._drawWalls();
    }


    _drawFlatObjects(objects: GameObject[], iframeDom: HTMLDivElement, context: CanvasRenderingContext2D | null) {

        const drawToDom = (shape: DomShape, object: GameObject) => {
            const dom = Renderer.styleDom(shape.getDom(), object);
            iframeDom.appendChild(dom);

            this._changeableSet.has(object) && this._changeableMap.set(object, dom);
        }

        const drawToCanvas = (shape: ImageShape, object: GameObject) => {
            const size = shape.getSize();
            const pos = object.getPosition();
            const [x, y] = [pos.x * PIXELSIZE, pos.y * PIXELSIZE];
            const [width, height] = [size.width * PIXELSIZE, size.height * PIXELSIZE];

            const img = new Image();
            img.src = shape.getImageUrl();
            img.onload = () =>
                context?.drawImage(img, x, y, width, height);
        }


        for (const object of objects) {
            const shape = object.getShape();

            if (shape instanceof DomShape) {
                drawToDom(shape, object);
            }

            else if (shape instanceof ImageShape) {
                drawToCanvas(shape, object);
            }
        }
    }


    _drawEffects() {
        const effects = this._world.getMap().getEffects();
        const iframeDom = this._iframeEffectDom;
        const context = this._imageEffectDom.getContext('2d');

        this._drawFlatObjects(effects, iframeDom, context);
    }


    _drawFloors() {
        const floors = this._world.getMap().getFloors();
        const iframeDom = this._iframeFloorDom;
        const context = this._imageFloorDom.getContext('2d');

        this._drawFlatObjects(floors, iframeDom, context);
    }


    _drawUnflatObjects(objects: GameObject[]) {

        const drawAsIframe = (shape: DomShape, object: GameObject) => {
            const dom = Renderer.styleDom(shape.getDom(), object);
            dom.style.zIndex = `${object.getPosition().y}`;

            this._wallDom.appendChild(dom);
            this._changeableSet.has(object) && this._changeableMap.set(object, dom);
        }

        const drawAsImage = (shape: ImageShape, object: GameObject) => {
            const img = Renderer.styleDom(document.createElement('img'), object);
            img.src = shape.getImageUrl();
            img.style.zIndex = `${object.getPosition().y}`;

            this._wallDom.appendChild(img);
            this._changeableSet.has(object) && this._changeableMap.set(object, img);
        }


        for (const object of objects) {
            const shape = object.getShape();

            if (shape instanceof DomShape) {
                drawAsIframe(shape, object);
            }
            else if (shape instanceof ImageShape) {
                drawAsImage(shape, object);
            }
        }
    }


    _updateUnflatObjects(entries: IterableIterator<[GameObject, HTMLElement]>) {

        const updateAsIframe = (shape: DomShape, object: GameObject, dom: HTMLElement) => {
            Renderer.styleDom(dom, object);
            dom.style.zIndex = `${object.getPosition().y}`;
        }

        const updateAsImage = (shape: ImageShape, object: GameObject, dom: HTMLImageElement) => {
            Renderer.styleDom(dom, object);
            dom.src = shape.getImageUrl();
            dom.style.zIndex = `${object.getPosition().y}`;
        }

        for (const [object, dom] of entries) {
            const shape = object.getShape();

            if (shape instanceof DomShape) {
                updateAsIframe(shape, object, dom);
            }
            else if (shape instanceof ImageShape) {
                updateAsImage(shape, object, dom as HTMLImageElement);
            }
        }
    }


    _drawWalls() {
        this._drawUnflatObjects(this._world.getMap().getWalls());
    }

    update() {
        this._updateUnflatObjects(this._changeableMap.entries());
    }

    getWrapperDom() {
        return this._wrapperDom;
    }
}