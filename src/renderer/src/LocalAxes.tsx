import * as THREE from 'three'
import { useEffect, useRef } from 'react'

interface ILocalAxesZUpProps {
	direction?: THREE.Vector3
	rotation?: number
	yUp?: boolean
}

export const LocalAxes = ({
	direction = new THREE.Vector3(1, 1, 1),
	rotation = 0,
	yUp = false
}: ILocalAxesZUpProps): React.JSX.Element => {
	const axesRef = useRef<THREE.AxesHelper>(null)
	const groupRef = useRef<THREE.Group>(null)

	useEffect(() => {
		if (!axesRef.current) return

		// Origem do helper
		const pos = axesRef.current.position.clone()

		// Vetor X local → direção até o ponto
		const xDir = new THREE.Vector3().subVectors(direction, pos).normalize()

		const yDir = new THREE.Vector3()
		const zDir = new THREE.Vector3()
		if (yUp) {
			// Vetor Y global
			const yGlobal = new THREE.Vector3(0, 1, 0)

			// Z local = X × Y_global
			zDir.copy(new THREE.Vector3().crossVectors(xDir, yGlobal).normalize())

			// Y local ajustado = Z × X
			yDir.copy(new THREE.Vector3().crossVectors(zDir, xDir).normalize())
		} else {
			// Vetor Z global (o que queremos preservar como Z local)
			const zGlobal = new THREE.Vector3(0, 0, 1)

			// Y local = Z_global × X
			yDir.copy(new THREE.Vector3().crossVectors(zGlobal, xDir).normalize())

			// Z local ajustado = X × Y
			zDir.copy(new THREE.Vector3().crossVectors(xDir, yDir).normalize())
		}

		// Montar matriz de rotação
		const matrixRotation = new THREE.Matrix4()
		matrixRotation.makeBasis(xDir, yDir, zDir)

		// Aplicar ao helper
		axesRef.current.setRotationFromMatrix(matrixRotation)

		// Rotation the helper around the axis
		groupRef.current?.rotateOnAxis(xDir, rotation)
	}, [direction, rotation, yUp])

	return (
		<group ref={groupRef}>
			<axesHelper ref={axesRef} args={[2]} />
		</group>
	)
}
