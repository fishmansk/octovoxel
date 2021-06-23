import * as THREE from 'three'

export default class ParticleManager {
    _timeBeforeNewParticle = 0.0


    constructor(scene, color = 0xffffff, ar = 1.0, count = 1000, frequence = 1.0, size = 1.0) {
        this.size = size
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
        this.geometry.setAttribute('color', new THREE.BufferAttribute(vertexColors, 3));

        // this.geometry = new THREE.BoxGeometry( 1, 1, 1 );

        this.material = new THREE.ShaderMaterial({
            fragmentShader: fShader,
            vertexShader: vShader,
            blending: THREE.NormalBlending,
            opacity: 0.5,
            transparent: true,
        })


        // this.material = new THREE.MeshBasicMaterial({
        //     color: 0xff0000,
        // })


        this.mesh = new THREE.InstancedMesh(this.geometry, this.material, this.count);

        this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);


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

        this.scene.add(this.mesh)
        const matrix = new THREE.Matrix4();
        const offset = new THREE.Vector3();
        const orientation = new THREE.Quaternion();
        const scale = new THREE.Vector3(1, 1, 1);
        const pm = this
        for (let i = 0; i < this.count; i++) {
            pm.dummy.position.set(-0, -0, -0)
            pm.dummy.updateMatrix()
            pm.mesh.setMatrixAt(i, pm.dummy.matrix)
        }
        // this.dummy.position.set(0, 0, 0)
        // pm.dummy.updateMatrix()
        pm.mesh.instanceMatrix.needsUpdate = true


    }

    update(deltaTime) {
        this._timeBeforeNewParticle -= deltaTime
        if ((this._timeBeforeNewParticle <= 0) && (this.mesh)) {

            this._timeBeforeNewParticle = this.frequence
            if (this.visibleCount < this.count) {


                this.visibleCount++
                const direction = Math.random() - 0.5
                let speed = 3 * (direction / Math.abs(direction))
                const dirV = Math.random()

                if (this.directionCount === 0){
                    if (Math.random() < 0.5){
                        this.direction.setX(1.0)

                    }
                    else{
                        this.direction.setX(-1.0)

                    }
                    if (Math.random() < 0.5){
                        this.direction.setY(1.0)

                    }
                    else{
                        this.direction.setY(-1.0)

                    }
                    if (Math.random() < 0.5){
                        this.direction.setZ(1.0)

                    }
                    else{
                        this.direction.setZ(-1.0)

                    }

                    this.directionCount = 5 + Math.round(Math.random() * 15)

                }
            this.directionCount -= 1
            // this.dummy.translateX(this.direction.x)
            // this.dummy.translateY(this.direction.y)
            // this.dummy.translateZ(this.direction.z)

                if (dirV < 0.3) {

                    this.dummy.translateX(speed)

                } else if (dirV < 0.6) {
                    this.dummy.translateY(speed)
                } else {
                    this.dummy.translateZ(speed)

                }


                this.dummy.updateMatrix()

                this.mesh.setMatrixAt(this.visibleCount - 1, this.dummy.matrix)
                this.mesh.instanceMatrix.needsUpdate = true
            }


        }

    }
}