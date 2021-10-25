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


    _changeableList: GameObject[];

    

    constructor(world: World, changeAbleList: GameObject[] = []) {
        this._world = world;
        this._changeableList = [...changeAbleList, ...world.getCharacters()];

        this._domSetup();
        this._drawAll();
    }

    _domSetup() {
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

        function drawToDom(shape: DomShape, object: GameObject) {
            const dom = Renderer.styleDom(shape.getDom(), object);
            iframeDom.appendChild(dom);
        }

        function drawToCanvas(shape: ImageShape, object: GameObject) {
            const size = shape.getSize();
            const pos = object.getPosition();
            const [x, y] = [pos.x + size.width / 2, pos.y + size.height / 2];

            const img = new Image();
            img.src = shape.getImageUrl();
            img.onload = () => 
                context?.drawImage(img, x, y, size.width, size.height);
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


    _drawWalls() {
        const walls = this._world.getMap().getEffects();
        const wrappingDom = this._wallDom;

        function drawAsIframe(shape: DomShape, wall: Wall) {
            const dom = Renderer.styleDom(shape.getDom(), wall);
            dom.style.zIndex = `${wall.getPosition().y}`;

            wrappingDom.appendChild(dom);
        }

        function drawAsImage(shape: ImageShape, wall: Wall) {
            const img = Renderer.styleDom(document.createElement('img'), wall);
            img.src = shape.getImageUrl();
            img.style.zIndex = `${wall.getPosition().y}`;

            wrappingDom.appendChild(img);
        }


        for (const wall of walls) {
            const shape = wall.getShape();
            
            if (shape instanceof DomShape) {
                drawAsIframe(shape, wall);
            }
            else if (shape instanceof ImageShape) {
                drawAsImage(shape, wall);
            }
        }
    }
}