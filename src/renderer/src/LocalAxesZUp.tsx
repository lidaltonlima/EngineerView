import * as THREE from 'three'
import { useEffect, useRef } from 'react'

interface ILocalAxesZUpProps {
	direction?: THREE.Vector3
}

export const LocalAxesZUp = ({
	direction = new THREE.Vector3(1, 1, 1)
}: ILocalAxesZUpProps): React.JSX.Element => {
	const ref = useRef<THREE.AxesHelper>(null)

	useEffect(() => {
		if (!ref.current) return

		// Origem do helper
		const pos = ref.current.position.clone()

		// Vetor X local → direção até o ponto
		const xDir = new THREE.Vector3().subVectors(direction, pos).normalize()

		// Vetor Z global (o que queremos preservar como Z local)
		const zGlobal = new THREE.Vector3(0, 0, 1)

		// Y local = Z_global × X
		const yDir = new THREE.Vector3().crossVectors(zGlobal, xDir).normalize()

		// Z local ajustado = X × Y
		const zDir = new THREE.Vector3().crossVectors(xDir, yDir).normalize()

		// Montar matriz de rotação
		const matrixRotation = new THREE.Matrix4()
		matrixRotation.makeBasis(xDir, yDir, zDir)

		// Aplicar ao helper
		ref.current.setRotationFromMatrix(matrixRotation)
	}, [direction])

	return <axesHelper ref={ref} args={[2]} />
}
