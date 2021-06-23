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
        this.camera.position.set(10, 10, 10);
        // this.camera.rotateOnAxis(new THREE.Vector3(-1, 1, -1), Math.PI / 4.0)
        this.camera.lookAt(0, 0, 0);
        this.camera.updateMatrix()


        this._controller = new CameraController(this.camera)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
        directionalLight.position.set(10, 10, 10)
        directionalLight.lookAt(0, 0, 0)
        this.scene.add(directionalLight)


        // this.octovoxel = new Octovoxel(512, new THREE.Vector3(0, 0, 0), 0, this.camera);
        // this.scene.add(this.octovoxel)


        var loader = new THREE.FileLoader();
        let fShader = null
        let vShader = null
        let fcShader = null
        let vcShader = null
        loader.load('shader.frag', function (data) {
                fShader = data;
                loader.load('shader.vert', function (data) {
                        vShader = data;
                        this.geometry = new THREE.SphereGeometry(3, 120, 120)
                        this.material = new THREE.MeshLambertMaterial({
                            color: 0x0000ff,
                        })

                        this.shaderMaterial = new THREE.ShaderMaterial({
                            uniforms: {
                                uTime: {type: 'f', value: 0.0},
                                uLightPosition: {type: 'vec3', value: this._lightPosition}
                            },
                            fragmentShader: fShader,
                            vertexShader: vShader,
                            blending: THREE.NormalBlending,
                            opacity: 0.5,
                            transparent: true,
                        })
                        // this.mesh = new THREE.Mesh(this.geometry, this.shaderMaterial)
                        // this.scene.add(this.mesh)


                        this.trianglesMeshs = [];
                        this.rotateVectors = []

                        for (let i = 0; i < 1000; i++) {
                            const shape = new THREE.Shape();
                            const startX = (Math.random() - 0.5) * 3
                            const startY = (Math.random() - 0.5) * 3
                            shape.moveTo(startX, startY);
                            shape.lineTo((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3);
                            shape.lineTo((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3);
                            shape.lineTo(startX, startY)
                            const geometry = new THREE.ShapeGeometry(shape);

                            // const geometry = new THREE.SphereGeometry(0.3 + Math.random() ,10,10)
                            const mesh = new THREE.Mesh(geometry, this.shaderMaterial);
                            mesh.rotateOnAxis(new THREE.Vector3(Math.random(), Math.random(), Math.random()), 3.1415926 * 0.5)
                            this.rotateVectors.push(new THREE.Vector3(Math.random(), Math.random(), Math.random()));
                            mesh.translateX((Math.random() - 0.5) * 30)
                            mesh.translateY((Math.random() - 0.5) * 30)
                            mesh.translateZ((Math.random() - 0.5) * 30)
                            this.trianglesMeshs.push(mesh);


                            this.scene.add(mesh);



                        }
                    // const sphereGeometry = new THREE.SphereGeometry( 5, 100, 100 );
                    // const sphereMaterial = new THREE.MeshLambertMaterial( {color: 0xffff00} );
                    // const sphereMesh = new THREE.Mesh( sphereGeometry, sphereMaterial );
                    // this.scene.add( sphereMesh );





                    }.bind(this)
                )
            }.bind(this)
        )

        loader.load('shaderCore.frag', function (data) {
                fcShader = data;
                loader.load('shaderCore.vert', function (data) {
                        vcShader = data;


                        this.coreShaderMaterial = new THREE.ShaderMaterial({
                            uniforms: {
                                uTime: {type: 'f', value: 0.0},
                                uLightPosition: {type: 'vec3', value: this._lightPosition}
                            },
                            fragmentShader: fcShader,
                            vertexShader: vcShader,
                            blending: THREE.NormalBlending,
                            opacity: 0.5,
                            transparent: true,
                        })
                        // this.mesh = new THREE.Mesh(this.geometry, this.shaderMaterial)
                        // this.scene.add(this.mesh)


                        // this.trianglesMeshs = [];
                        // this.rotateVectors = []


                        const sphereGeometry = new THREE.SphereGeometry( 2.5, 300, 300 );
                        // const sphereMaterial = new THREE.MeshLambertMaterial( {color: 0xffff00} );
                        const sphereMesh = new THREE.Mesh( sphereGeometry, this.coreShaderMaterial );
                        this.scene.add( sphereMesh );





                    }.bind(this)
                )
            }.bind(this)
        )


        // this.mesh = new THREE.Mesh(this.geometry, this.material)
        // this.scene.add(this.mesh)



        // const axesHelper = new THREE.AxesHelper(1000)
        // this.scene.add(axesHelper)
        // this.octovoxel.add(axesHelper)

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
        if (this.trianglesMeshs){
            for (let i = 0; i < this.trianglesMeshs.length; i++){
                this.trianglesMeshs[i].rotateOnAxis(this.rotateVectors[i], deltaTime)
                this.trianglesMeshs[i].rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), deltaTime)
            }

        }


        this._controller.update(deltaTime)
        // this.octovoxel.update(deltaTime)
        this.updateUniforms(deltaTime)

    }

    updateUniforms(deltaTime) {
        if (this.shaderMaterial) {
            this.shaderMaterial.needsUpdate = true;
            this.shaderMaterial.uniforms.uTime.value = this._time;


        }
        if (this.coreShaderMaterial) {
            this.coreShaderMaterial.needsUpdate = true;
            this.coreShaderMaterial.uniforms.uTime.value = this._time;


        }


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