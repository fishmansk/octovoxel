import * as THREE from 'three'
import LogoManager from "./LogoManager";


export default class ParticleManager extends THREE.Object3D {
    _timeBeforeNewParticle = 0.0
    _time = 0.0

    constructor(scene, color = 0xffffff, ar = 1.0, count = 1000, frequence = 1.0, size = 1.0, start = new THREE.Vector3()) {

        super()
        if (Math.random() < 0.1){
            this.logoManager=  new LogoManager()
            this.logoManager.build()
            this.logoManager.rotateOnWorldAxis(new THREE.Vector3(1.0, 0.0, 0.0), - Math.PI / 2.0)
            this.add(this.logoManager)

        }



        this.verticalSpeed = 5.0 + Math.random() * 15.0
        this.size = size
        this.position.set(start.x, start.y, start.z)
        this.updateMatrix()
        this.color = color
        this.dummy = new THREE.Object3D()
        this.scene = scene
        this.ar = ar
        this.count = count
        this.visibleCount = 0
        this.frequence = frequence
        let loader = new THREE.FileLoader();
        let fShader = null
        let vShader = null
        this.direction = new THREE.Vector3(0, 0, 0)
        this.directionCount = 0
        loader.load('particle/shader.frag', function (data) {
                fShader = data;
                loader.load('particle/shader.vert', function (data) {
                        vShader = data;
                        this.init(fShader, vShader)

                    }.bind(this)
                )
            }.bind(this)
        )


    }

    init(fShader, vShader) {
        this.geometry = new THREE.BufferGeometry()
        const vertices = new Float32Array([
            0.0, 0.0, 0.0,
            0.0, 0.0, 0.0,
            0.0, 0.0, 0.0,

            0.0, 0.0, 0.0,
            0.0, 0.0, 0.0,
            0.0, 0.0, 0.0,

            // 1.0, -1.0, 0.0,
            // 1.0, 1.0, 0.0,
            // -1.0, 1.0, 0.0,
            //
            // -1.0, 1.0, 0.0,
            // -1.0, -1.0, 0.0,
            // 1.0, -1.0, 0.0,
        ])
        const vertexOffsetValues = [
            1.0, -1.0 * this.ar,
            1.0, 1.0 * this.ar,
            -1.0, 1.0 * this.ar,

            -1.0, 1.0 * this.ar,
            -1.0, -1.0 * this.ar,
            1.0, -1.0 * this.ar,

        ]
        for (let i = 0; i < vertexOffsetValues.length; i++) {
            vertexOffsetValues[i] *= this.size
        }
        const vertexOffset = new Float32Array(vertexOffsetValues)

        // const vertexOffset = new Float32Array([
        //     1.0, -1.0 * this.ar,
        //     1.0, 1.0 * this.ar,
        //     -1.0, 1.0 * this.ar,
        //
        //     -1.0, 1.0 * this.ar,
        //     -1.0, -1.0 * this.ar,
        //     1.0, -1.0 * this.ar,
        //
        // ])

        const color = new THREE.Color(this.color)
        const vertexColors = new Float32Array([
            color.r, color.g, color.b,
            color.r, color.g, color.b,
            color.r, color.g, color.b,
            color.r, color.g, color.b,
            color.r, color.g, color.b,
            color.r, color.g, color.b,
        ])

        this.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        this.geometry.setAttribute('offset', new THREE.BufferAttribute(vertexOffset, 2));
        this.geometry.setAttribute('colorVertex', new THREE.BufferAttribute(vertexColors, 3));

        // this.geometry = new THREE.BoxGeometry( 1, 1, 1 );

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: {type: 'f', value: 0.0},
                uCount: {type: 'f', value: 0.0}

            },
            fragmentShader: fShader,
            vertexShader: vShader,
            blending: THREE.NormalBlending,
            // opacity: 0.5,
            transparent: true,
        })


        // this.material = new THREE.MeshBasicMaterial({
        //     color: 0xff0000,
        // })

        // this.material = new THREE.MeshPhongMaterial({
        //     color: 0xff0000,
        // })


        this.mesh = new THREE.InstancedMesh(this.geometry, this.material, this.count);
        const instancedOrderAttribute = []
        for (let i = 0; i < this.count; i++) {
            instancedOrderAttribute.push(i)
        }
        this.geometry.setAttribute('order', new THREE.InstancedBufferAttribute(new Int32Array(instancedOrderAttribute), 1))

        // this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        // this.mesh.instanceColor.setUsage(THREE.DynamicDrawUsage);


        // const geometry = new THREE.BufferGeometry();
        // const vertices = new Float32Array( [
        //     -1.0, -1.0,  1.0,
        //     1.0, -1.0,  1.0,
        //     1.0,  1.0,  1.0,
        //
        //     1.0,  1.0,  1.0,
        //     -1.0,  1.0,  1.0,
        //     -1.0, -1.0,  1.0
        // ] );
        //
        // geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        // const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        // const mesh = new THREE.Mesh( geometry, material );

        this.add(this.mesh)
        const pm = this
        for (let i = 0; i < this.count; i++) {
            pm.dummy.position.set(-0, -0, -0)
            pm.dummy.updateMatrix()
            pm.mesh.setMatrixAt(i, pm.dummy.matrix)
            pm.mesh.setColorAt(i, new THREE.Color(0xff0000))
            pm.mesh.instanceColor.needsUpdate = true;
        }

        // pm.dummy.updateMatrix()
        pm.mesh.instanceMatrix.needsUpdate = true


    }

    reset() {
        this._time = 0.0
        this.visibleCount = 0

        for (let i = 0; i < this.count; i++) {
            this.dummy.position.set(-0, -0, -0)
            this.dummy.updateMatrix()
            this.mesh.setMatrixAt(i, this.dummy.matrix)
            this.mesh.setColorAt(i, new THREE.Color(0xff0000))
            this.mesh.instanceColor.needsUpdate = true;
        }

        // pm.dummy.updateMatrix()
        this.mesh.instanceMatrix.needsUpdate = true
    }

    update(deltaTime) {
        this.position.setY(this.position.y + this.verticalSpeed * deltaTime)
        if (this.mesh) {
            this.mesh.updateMatrix()

        }
        this._time += deltaTime
        if (this.material) {
            this.material.needsUpdate = true;
            this.material.uniforms.uTime.value = this._time;
            this.material.uniforms.uCount.value = this.visibleCount;
        }
        this._timeBeforeNewParticle -= deltaTime
        if ((this._timeBeforeNewParticle <= 0) && (this.mesh)) {

            this._timeBeforeNewParticle = this.frequence
            if (this.visibleCount < this.count) {


                this.visibleCount++
                const direction = Math.random() - 0.5
                let speed = 3 * (direction / Math.abs(direction))
                const dirV = Math.random()

                if (this.directionCount === 0) {
                    if (dirV < 0.49) {
                        if (Math.random() < 0.5) {
                            this.direction.set(1.0, 0, 0)

                        } else {
                            this.direction.set(-1.0, 0, 0)

                        }

                    } else if (dirV < 0.98) {
                        if (Math.random() < 0.5) {
                            this.direction.set(0, 0, 1.0,)

                        } else {
                            this.direction.set(0, 0, -1.0,)

                        }

                    } else {
                        if (Math.random() < 0.5) {
                            this.direction.set(0, 1.0, 0)

                        } else {
                            this.direction.set(0, -1.0, 0)

                        }

                    }


                    this.directionCount = 3 + Math.round(Math.random() * 5)

                }
                this.directionCount -= 1
                this.dummy.translateX(this.direction.x * this.size * 2)
                this.dummy.translateY(this.direction.y * this.size * 2)
                this.dummy.translateZ(this.direction.z * this.size * 2)


                this.dummy.updateMatrix()

                this.mesh.setMatrixAt(this.visibleCount - 1, this.dummy.matrix)
                this.mesh.instanceMatrix.needsUpdate = true
                this.mesh.instanceColor.needsUpdate = true
            }


        }

    }
}