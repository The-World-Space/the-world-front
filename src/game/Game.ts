import * as THREE from "three";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer";

class Game {
    private readonly rootScene: THREE.Scene;
    private readonly camera: THREE.OrthographicCamera;
    private readonly renderer: CSS3DRenderer;
    private animationFrameId: number | null;

    public constructor(container: HTMLElement, screenWidth: number, screenHeight: number) {
        this.rootScene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(
            screenWidth / - 2,
            screenWidth / 2,
            screenHeight / 2,
            screenHeight / - 2,
            1,
            1000
        );
        this.renderer = new CSS3DRenderer();
        this.renderer.setSize(screenWidth, screenHeight);
        this.animationFrameId = null;
        container.appendChild(this.renderer.domElement);
    }

    public resizeFramebuffer(width: number, height: number) {   
        this.camera.left = width / - 2;
        this.camera.right = width / 2;
        this.camera.top = height / 2;
        this.camera.bottom = height / - 2;
		//this.camera = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    public run() {
        this.animationFrameId = requestAnimationFrame(() => this.run());
        this.renderer.render(this.rootScene, this.camera);
    }

    public dispose() {
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    }
}

export default Game;
