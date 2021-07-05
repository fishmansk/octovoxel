import * as THREE from 'three';
import Octovoxel from "./components/Octovoxel";
import CameraController from "./service/CameraController";
import {BoxGeometry} from "three";
import ParticleManager from "./components/ParticleManager";
import LogoManager from "./components/LogoManager";
export default class App {


    _scene = null
    _renderer = null
    _canvas = null
    _camera = null
    _predTime = +new Date()
    _controller = null

    _time = 0.0

    _lightPosition = new THREE.Vector3(10, 10, 10)

    beforeNewLayer = 999.0
    dummy = new THREE.Object3D()
    beforeNewPoint = 0.0

    constructor() {
        this.direction = {
            horizontal: 0.0,
            vertical: 0.0,
            rotating: false,
            oldX: 0.0,
            oldY: 0.0,
            startX: 0.0,
            startY: 0.0,

        }
        this.scaling = {
            speed: 1.0,
            direction: 0.0,
            max: 3.0,
            min: 1.0,
        }
        this.scene = new THREE.Scene();
        this.canvas = document.getElementById('main-view')
        this.canvas.width = this.canvas.clientWidth
        this.canvas.height = this.canvas.clientHeight




        this.canvas.onmousedown = function (e) {
            if (e.button === 0) {
                console.log('rotating start')
                this.direction.rotating = true
                this.direction.oldX = e.clientX
                this.direction.oldY = e.clientY
                this.direction.startX = e.clientX
                this.direction.startY = e.clientY
            }

        }.bind(this);

        this.canvas.onmouseup = function (e) {
            if (e.button === 0) {
                if (e.clientX - this.direction.startX + e.clientY - this.direction.startY < 5){
                    for (let particleManager of this.root.children){
                        particleManager._time = 0.0
                    }
                    console.log('Demand click')
                }
                console.log('rotating end')
                this.direction.rotating = false
            }
        }.bind(this);

        this.canvas.onmousemove = function (e) {
            if (this.direction.rotating) {
                this.direction.horizontal += 0.01 * (e.clientX - this.direction.oldX)
                // this.direction.vertical += 0.01 * (e.clientY - this.direction.oldY)
                console.log('rotating move')
                this.direction.oldX = e.clientX
                this.direction.oldY = e.clientY
            }


        }.bind(this);


        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
        });
        // this.renderer.setClearColor(0xffffff, 1.0)
        this.renderer.setClearColor(0x000000, 1.0)
        this.renderer.clearColor()
        this.ar = this.canvas.width / this.canvas.height
        this.scale = 1.0 + (1.0 / this.ar)
        this.camera = new THREE.PerspectiveCamera(
            50, this.ar, 50.0, 35000
        )
        // this.camera = new THREE.PerspectiveCamera(
        //     50, this.canvas.width / this.canvas.height, 0.1, 35000
        // )
        this.camera.position.set(0, 200, 200);
        // this.camera.rotateOnAxis(new THREE.Vector3(-1, 1, -1), Math.PI / 4.0)
        this.camera.lookAt(0, 0, -1);
        this.camera.updateMatrix()


        this._controller = new CameraController(this.camera)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
        directionalLight.position.set(10, 10, 10)
        directionalLight.lookAt(0, 0, 0)
        this.scene.add(directionalLight)


        this.root = new THREE.Object3D()
        this.scene.add(this.root)


        // this.particleManager = new ParticleManager(this.root, 0xff0000, this.ar, 1000, 0.001)
        // this.particleManager1 = new ParticleManager(this.root, 0x00ff00, this.ar, 1000, 0.001)
        // this.particleManager2 = new ParticleManager(this.root, 0x0000ff, this.ar, 1000, 0.001)
        // this.particleManager3 = new ParticleManager(this.root, 0xffff00, this.ar, 1000, 0.001)
        // this.particleManager4 = new ParticleManager(this.root, 0x00ffff, this.ar, 1000, 0.001)
        // this.particleManager5 = new ParticleManager(this.root, 0xffffff, this.ar, 1000, 0.001)
        this.particleManagers = []
        for (let i = 0; i < 150; i++) {
            const color = new THREE.Color(
                Math.random() * 0.2 + 0.3,
                Math.random() * 0.7 + 0.3,
                Math.random() * 0.7 + 0.3,
            )
            const particleManager = new ParticleManager(this.root, color.getHex(), this.ar, 200, 0.001,
                (0.5 + Math.random()) * this.scale,
                new THREE.Vector3(
                    (Math.random() - 0.5) * 250.0 * this.ar,
                    (Math.random() - 0.5) * 100.0,
                    (Math.random() - 0.5) * 250.0* this.ar,
                ))
            this.root.add(particleManager)
            // this.particleManagers.push(
            //     particleManager,
            // )

        }


        // this.logoManager=  new LogoManager()
        // this.logoManager.build()
        // this.logoManager.rotateOnWorldAxis(new THREE.Vector3(1.0, 0.0, 0.0), - Math.PI / 2.0)
        // this.scene.add(this.logoManager)

        // const axesHelper = new THREE.AxesHelper(1000)
        // this.scene.add(axesHelper)

        window.requestAnimationFrame(this.beforeUpdate.bind(this))
    }


    beforeUpdate() {
        const time = +new Date()
        const deltaTime = (time - this.predTime) / 1000.0 || 0
        this.predTime = time

        this.update(deltaTime);
        this.render();
        window.requestAnimationFrame(this.beforeUpdate.bind(this))
    }

    update(deltaTime) {
        this._time += deltaTime
        if (Math.random() < 0.1) {
            let worldScale = new THREE.Vector3()
            this.root.getWorldScale(worldScale)
            console.log(worldScale)


        }


        // this.root.rotateOnAxis(new THREE.Vector3(0.0, 1.0, 0.0), 0.1 * deltaTime)
        // this.root.rotateOnWorldAxis(new THREE.Vector3(this.direction.vertical, this.direction.horizontal, 0.0), deltaTime)
        this.root.rotateOnWorldAxis(new THREE.Vector3(1.0, 0.0, 0.0), deltaTime * this.direction.vertical)
        this.root.rotateOnWorldAxis(new THREE.Vector3(0.0, 1.0, 0.0), deltaTime * this.direction.horizontal)
        this.direction.vertical *= (1.0 - 0.5 * deltaTime)
        this.direction.horizontal *= (1.0 - 0.5 * deltaTime)
        // this.particleManager.update(deltaTime)
        // this.particleManager1.update(deltaTime)
        // this.particleManager2.update(deltaTime)
        // this.particleManager3.update(deltaTime)
        // this.particleManager4.update(deltaTime)
        // this.particleManager5.update(deltaTime)

        const forRemoving = []
        for (let particleManager of this.root.children) {
            particleManager.update(deltaTime)
            if (particleManager.position.y > 100.0) {
                particleManager.position.set(
                    (Math.random() - 0.5) * 250.0* this.ar,
                    (Math.random() - 1.5) * 50.0,
                    (Math.random() - 0.5) * 250.0* this.ar,
                )
                particleManager.reset()

                // this.root.remove(particleManager)
                // if (this.root.children.includes([particleManager])){

                // this.particleManagers = this.particleManagers.splice(this.particleManagers.indexOf(particleManager), 1)
                // }

                // // forRemoving.push(particleManager)
                // const color = new THREE.Color(
                //     Math.random() * 0.7 + 0.3,
                //     Math.random() * 0.2 + 0.3,
                //     Math.random() * 0.7 + 0.3,
                // )
                // const particleManager = new ParticleManager(this.root, color.getHex(), this.ar, 200, 0.001,
                //     0.5 + Math.random(),
                //     new THREE.Vector3(
                //         (Math.random() - 0.5) * 100.0,
                //         (Math.random() - 0.5) * 10.0,
                //         (Math.random() - 0.5) * 100.0,
                //     ))
                // this.root.add(particleManager)
                // this.particleManagers.push(
                //     particleManager,
                // )
            }
        }
        // for (let pm of forRemoving) {
        //     this.root.remove(pm)
        //     this.particleManagers = this.particleManagers.splice(this.particleManagers.indexOf(pm), 1)
        // }

        this._controller.update(deltaTime)
        this.updateUniforms(deltaTime)

    }

    updateUniforms(deltaTime) {


    }

    render() {


        this.renderer.render(this.scene, this.camera);

    }

    get scene() {
        return this._scene;
    }

    set scene(value) {
        this._scene = value;
    }

    get renderer() {
        return this._renderer;
    }

    set renderer(value) {
        this._renderer = value;
    }

    get canvas() {
        return this._canvas;
    }

    set canvas(value) {
        this._canvas = value;
    }

    get camera() {
        return this._camera;
    }

    set camera(value) {
        this._camera = value;
    }

    get predTime() {
        return this._predTime;
    }

    set predTime(value) {
        this._predTime = value;
    }

    onkeydown(event) {

    }

    onkeyup(event) {

    }


}