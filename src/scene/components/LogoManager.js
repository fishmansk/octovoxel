import * as THREE from 'three'

export default class LogoManager extends THREE.Object3D {

    constructor() {
        super();
    }

    build() {
        this.geometry = new THREE.PlaneGeometry(40, 40, 40)
        this.texture = new THREE.TextureLoader().load('textures/rsatu.png')
        this.material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: this.texture,
            depthWrite: false,
            depthTest: false,
            transparent: true,
        })
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.add(this.mesh)

    }

    update(deltaTime) {

    }
}