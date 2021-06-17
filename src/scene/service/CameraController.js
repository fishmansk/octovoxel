import * as THREE from 'three';

export default class CameraController {

    constructor(camera) {
        this.camera = camera
        this.speed = 10
        this.forwardSpeed = 0
        this.leftSpeed = 0
        window.onkeydown = this.onkeydown.bind(this)
        window.onkeyup = this.onkeyup.bind(this)
        window.onmousedown = this.onmousedown.bind(this)
        window.onmouseup = this.onmouseup.bind(this)
        window.onmousemove = this.onmousemove.bind(this)


    }


    update(deltaTime) {
        this.movingUpdate(deltaTime)
    }

    movingUpdate(deltaTime) {
        const forwardDelta = this.speed * deltaTime * this.forwardSpeed
        this.forward(forwardDelta)
        const leftDelta = this.speed * deltaTime * this.leftSpeed
        this.moveToLeft(leftDelta)


    }


    forward(dist) {
        let cameraDirection = new THREE.Vector3()
        this.camera.getWorldDirection(cameraDirection)
        let direction = new THREE.Vector3(cameraDirection.x, cameraDirection.y, cameraDirection.z)
        direction.normalize()
        direction.multiplyScalar(dist)
        this.camera.position.x += direction.x
        this.camera.position.y += direction.y
        this.camera.position.z += direction.z

    }


    moveToLeft(dist) {
        this.camera.translateX(-dist)
    }


    onkeydown(event) {
        if (event.code === 'KeyW') {
            this.forwardSpeed = 1
        }
        if (event.code === 'KeyS') {
            this.forwardSpeed = -1
        }
        if (event.code === 'KeyA') {
            this.leftSpeed = 1
        }
        if (event.code === 'KeyD') {
            this.leftSpeed = -1
        }
    }

    onkeyup(event) {
        if (event.code === 'KeyW') {
            this.forwardSpeed = 0
        }
        if (event.code === 'KeyS') {
            this.forwardSpeed = 0
        }
        if (event.code === 'KeyA') {
            this.leftSpeed = 0
        }
        if (event.code === 'KeyD') {
            this.leftSpeed = 0
        }

    }

    onmousedown(event) {

    }

    onmouseup(event) {

    }

    onmousemove(event) {

    }
}