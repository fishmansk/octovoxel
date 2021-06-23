import * as THREE from 'three';
import Octovoxel from "./components/Octovoxel";
import CameraController from "./service/CameraController";
import {BoxGeometry} from "three";

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

    constructor() {
        this.scene = new THREE.Scene();
        this.canvas = document.getElementById('main-view')
        this.canvas.width = this.canvas.clientWidth
        this.canvas.height = this.canvas.clientHeight


        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
        });
        // this.renderer.setClearColor(0xffffff, 1.0)
        this.renderer.setClearColor(0x000000, 1.0)
        this.renderer.clearColor()

        this.camera = new THREE.PerspectiveCamera(
            50, this.canvas.width / this.canvas.height, 0.1, 35000
        )
        this.camera.position.set(0, 0, 100);
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


        // const geometry = new THREE.PlaneGeometry(1, 1);
        // const material = new THREE.MeshBasicMaterial({
        //     color: 0xffff00,
        //     side: THREE.DoubleSide,
        //     opacity: 0.5,
        //     transparent: true
        // });
        // const plane = new THREE.Mesh(geometry, material);
        // this.scene.add(plane);


        // this.octovoxel = new Octovoxel(512, new THREE.Vector3(0, 0, 0), 0, this.camera);
        // this.scene.add(this.octovoxel)

        for (let l = 0; l < 10; l++) {
            const layer = this.newLayer()
            for (let i = 0; i < 5; i++) {
                const line = this.newLine()
                this.newParticle(line)
                layer.add(line)

            }
            layer.position.setZ(l * 25)
            this.root.add(layer)
        }


        const axesHelper = new THREE.AxesHelper(1000)
        this.scene.add(axesHelper)

        window.requestAnimationFrame(this.beforeUpdate.bind(this))
    }


    newLayer() {
        const layer = new THREE.Object3D();
        return layer
    }

    newLine() {
        const line = new THREE.Object3D()

        line.rf = {
            meshes: [],
            countSteps: 0,
            direction: {
                x: 1,
                y: 1,
            },
            fading: Math.random() * 0.005,
            opacity: 1.0,
            size: Math.random() * 0.5,
            color: new THREE.Color(0.7 + Math.random() * 0.3, 0.7 + Math.random() * 0.3, 0.7 + Math.random() * 0.3),
            time: 0.0,
            interval: 0.005 + Math.random() * 0.005,
            lastPosition: new THREE.Vector3(),
            count: 0,
        }
        const geometry = new THREE.PlaneGeometry(line.rf.size, line.rf.size);
        const material = new THREE.MeshBasicMaterial({
            color: line.rf.color.getHex(),
            side: THREE.DoubleSide,
            opacity: 0.5,
            transparent: true
        });
        const mesh = new THREE.InstancedMesh(geometry, material, 50 + Math.floor(Math.random() * 1500));
        mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        for (let i = 0; i < mesh.count; i++) {
            this.dummy.position.set(9999999999999,99999999999, 999999999999999)
            this.dummy.updateMatrix();
            mesh.setMatrixAt(i, this.dummy.matrix)
        }

        line.rf.mesh = mesh
        line.rf.mesh.instanceMatrix.needsUpdate = true
        line.add(mesh)


        return line
    }

    newParticle(line) {
        if (line.rf.countSteps === 0) {
            line.rf.countSteps = 3 + Math.floor(Math.random() * 10);
            const rv = Math.random()
            if (rv < 0.25) {
                line.rf.direction.x = 0
                line.rf.direction.y = 1
            } else {
                if (rv < 0.5) {
                    line.rf.direction.x = 1
                    line.rf.direction.y = 0
                } else {
                    if (rv < 0.75) {
                        line.rf.direction.x = 0
                        line.rf.direction.y = -1
                    } else {
                        line.rf.direction.x = -1
                        line.rf.direction.y = 0

                    }

                }

            }
        } else {
            line.rf.countSteps--
        }
        // line.rf.opacity -= line.rf.fading

        // const geometry = new THREE.PlaneGeometry(line.rf.size, line.rf.size);
        // const material = new THREE.MeshBasicMaterial({
        //     color: line.rf.color.getHex(),
        //     side: THREE.DoubleSide,
        //     opacity: line.rf.opacity,
        //     transparent: true
        // });
        // const plane = new THREE.Mesh(geometry, material);

        if (line.rf.count === 0) {
            line.rf.lastPosition.set(0, 0, 0)
        } else {
            line.rf.lastPosition.add(new THREE.Vector3(
                line.rf.direction.x * 2 * line.rf.size,
                line.rf.direction.y * 2 * line.rf.size,
                0,
            ))
        }
        line.rf.count += 1
        this.dummy.position.setX(line.rf.lastPosition.x)
        this.dummy.position.setY(line.rf.lastPosition.y)
        this.dummy.position.setZ(line.rf.lastPosition.z)
        this.dummy.updateMatrix();

        line.rf.mesh.setMatrixAt(line.rf.count - 1, this.dummy.matrix)
        line.rf.mesh.instanceMatrix.needsUpdate = true;
        // if (line.children.length > 0) {
        //     const position = line.children[line.children.length - 1].position.clone()
        //     plane.position.set(position.x, position.y, position.z)
        //     plane.translateX(line.rf.direction.x * 2 * line.rf.size)
        //     plane.translateY(line.rf.direction.y * 2 * line.rf.size)
        //
        // }
        // line.add(plane);

    }

    updateLine(deltaTime, line) {
        if (line.rf.opacity < 0) return
        line.rf.time += deltaTime
        if (line.rf.time > line.rf.interval) {
            line.rf.time -= line.rf.interval
            this.newParticle(line)
        }
    }

    updateLayers(deltaTime) {
        for (let layer of this.root.children) {
            layer.translateZ(-15 * deltaTime)
            layer.updateMatrix()
            for (let line of layer.children) {
                this.updateLine(deltaTime, line)
            }
        }

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


        this.beforeNewLayer += deltaTime
        for (let layer of this.root.children){
            layer.rotateOnAxis(new THREE.Vector3(0.5, 0.5, 0.5), 1 * deltaTime)
        }
        // if (this.beforeNewLayer > 5.0) {
        //     this.beforeNewLayer -= 5.0
        //     // this.root.remove(this.root.children[0])
        //     const layer = this.newLayer()
        //     for (let i = 0; i < 1; i++) {
        //         const line = this.newLine()
        //         layer.add(line)
        //
        //     }
        //     layer.position.setZ(100)
        //
        //     this.root.add(layer)
        // }
        this.updateLayers(deltaTime)

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