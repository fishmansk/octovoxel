import * as THREE from 'three';

export default class Octovoxel extends THREE.Object3D {
    constructor() {
        super();
        this.build()
    }

    update(dt) {

    }

    render(renderer) {

    }

    build() {
        if (this.mesh) {
            this.remove(this.mesh)
        }

        const boxGeometry = new THREE.BoxGeometry(512, 512, 512)
        const edgeGeometry = new THREE.EdgesGeometry(boxGeometry)

        const material = new THREE.MeshBasicMaterial({
            color: 0x000000,
        })
        this.mesh = new THREE.LineSegments(edgeGeometry, material)

        // this.mesh = new THREE.Mesh(geometry, material)
        this.add(this.mesh)
    }

}