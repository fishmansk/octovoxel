import * as THREE from 'three';

export default class Octovoxel extends THREE.Object3D {


    /*
    Каждый suboctovoxel задается с помощью трех букв следующим образом:
    F | B, U | D, L | R
    Front/Back - ось Z, Up/Down - ось Y, Left,Right - ось X
    */

    _size = 0
    _depth = 0


    luf = null
    ruf = null
    rdf = null
    ldf = null

    lub = null
    rub = null
    rdb = null
    ldb = null

    _visibleMesh = null
    _wireframeMesh = null
    _isDetailed = false

    __cameraWorldPosition = new THREE.Vector3()
    __worldPosition = new THREE.Vector3()

    constructor(size = 8, position = new THREE.Vector3(0, 0, 0), depth = 3, camera) {
        super();
        this._size = size
        this._depth = depth;
        this.camera = camera
        this.position.set(position.x, position.y, position.z)
        const o = size / 4
        this.detail(depth)


        this.build()


    }

    createLUF(depth = 0) {
        const offset = this.size / 4;
        this.luf = new Octovoxel(this.size / 2, new THREE.Vector3(-offset, +offset, +offset), depth, this.camera)
        this.add(this.luf)
    }

    createRUF(depth = 0) {
        const offset = this.size / 4;
        this.ruf = new Octovoxel(this.size / 2, new THREE.Vector3(+offset, +offset, +offset), depth, this.camera)
        this.add(this.ruf)
    }

    createLDF(depth = 0) {
        const offset = this.size / 4;
        this.ldf = new Octovoxel(this.size / 2, new THREE.Vector3(-offset, -offset, +offset), depth, this.camera)
        this.add(this.ldf)
    }

    createRDF(depth = 0) {
        const offset = this.size / 4;
        this.rdf = new Octovoxel(this.size / 2, new THREE.Vector3(+offset, -offset, +offset), depth, this.camera)
        this.add(this.rdf)
    }

    createLUB(depth = 0) {
        const offset = this.size / 4;
        this.lub = new Octovoxel(this.size / 2, new THREE.Vector3(-offset, +offset, -offset), depth, this.camera)
        this.add(this.lub)
    }

    createRUB(depth = 0) {
        const offset = this.size / 4;
        this.rub = new Octovoxel(this.size / 2, new THREE.Vector3(+offset, +offset, -offset), depth, this.camera)
        this.add(this.rub)
    }

    createLDB(depth = 0) {
        const offset = this.size / 4;
        this.ldb = new Octovoxel(this.size / 2, new THREE.Vector3(-offset, -offset, -offset), depth, this.camera)
        this.add(this.ldb)
    }

    createRDB(depth = 0) {
        const offset = this.size / 4;
        this.rdb = new Octovoxel(this.size / 2, new THREE.Vector3(+offset, -offset, -offset), depth, this.camera)
        this.add(this.rdb)
    }

    detail(depth = 1) {
        if (this._isDetailed) return;
        if (depth > 0) {
            this.createLUF(depth - 1)
            this.createRUF(depth - 1)
            this.createLDF(depth - 1)
            this.createRDF(depth - 1)
            this.createLUB(depth - 1)
            this.createRUB(depth - 1)
            this.createLDB(depth - 1)
            this.createRDB(depth - 1)


        }
        if (this._visibleMesh) {
            this._visibleMesh.visible = false

        }
        this._isDetailed = true
    }

    reset() {
        if (!this._isDetailed) return;
        if (this.luf) {
            this.luf.reset()
            this.luf.clear()
            this.remove(this.luf)
            this.luf = false
        }
        if (this.ruf) {
            this.ruf.reset()
            this.ruf.clear()
            this.remove(this.ruf)
            this.ruf = false
        }
        if (this.ldf) {
            this.ldf.reset()
            this.ldf.clear()
            this.remove(this.ldf)
            this.ldf = false
        }
        if (this.rdf) {
            this.rdf.reset()
            this.rdf.clear()
            this.remove(this.rdf)
            this.rdf = false
        }
        if (this.lub) {
            this.lub.reset()
            this.lub.clear()
            this.remove(this.lub)
            this.lub = false
        }
        if (this.rub) {
            this.rub.reset()
            this.rub.clear()
            this.remove(this.rub)
            this.rub = false
        }
        if (this.ldb) {
            this.ldb.reset()
            this.ldb.clear()
            this.remove(this.ldb)
            this.ldb = false
        }
        if (this.rdb) {
            this.rdb.reset()
            this.rdb.clear()
            this.remove(this.rdb)
            this.rdb = false
        }
        if (this._visibleMesh) {
            this._visibleMesh.visible = true

        }
        this._isDetailed = false
    }

    update(dt) {
        if (!this.camera) return;
        this.camera.getWorldPosition(this.__cameraWorldPosition)
        this.getWorldPosition(this.__worldPosition)
        if (this.__worldPosition.distanceTo(this.__cameraWorldPosition) < this.size * 2) {
            if (!this._isDetailed){
                console.log('DETAIL')
                this.detail()
            }
        } else {
            if (this._isDetailed){
                console.log('RESET')
                this.reset()
            }
        }
        if (this._isDetailed){
            for (let suboctovoxel of [
                this.luf,
                this.ruf,
                this.rdf,
                this.ldf,
                this.lub,
                this.rub,
                this.rdb,
                this.ldb,
            ]) {
                if (suboctovoxel){
                    suboctovoxel.update(dt)

                }

            }
        }

    }


    build() {
        if (this.mesh) {
            this.remove(this.mesh)
        }

        const boxGeometry = new THREE.BoxGeometry(this.size, this.size, this.size)
        // const edgeGeometry = new THREE.EdgesGeometry(boxGeometry)

        // const material = new THREE.MeshBasicMaterial({
        //     color: 0x000000,
        // })
        // this._wireframeMesh = new THREE.LineSegments(edgeGeometry, material)

        const visibleMaterial = new THREE.MeshLambertMaterial({
            color: (new THREE.Color(Math.random() * 255, Math.random() * 255, Math.random() * 255)).getHex(),

        })

        visibleMaterial.opacity = 0.5
        visibleMaterial.transparent = true

        this._visibleMesh = new THREE.Mesh(boxGeometry, visibleMaterial)

        // this.mesh = new THREE.Mesh(geometry, material)
        this.add(this._visibleMesh)
        // this.add(this._wireframeMesh)
    }

    get size() {
        return this._size;
    }

    get depth() {
        return this._depth;
    }

    get color() {
        if (this._visibleMesh) {
            return this._visibleMesh.material.color;
        }
        return null
    }

    set color(color) {
        if (this._visibleMesh) {
            this._visibleMesh.material.color.set(color);
        }
    }


}