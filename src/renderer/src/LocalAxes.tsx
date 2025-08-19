import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { Axes } from './components/3d/objects'

interface ILocalAxesCustomProps {
	direction?: THREE.Vector3
	rotation?: number
	yUp?: boolean
	scale?: number
	label?: boolean
}

type ILocalAxesProps = ILocalAxesCustomProps & React.JSX.IntrinsicElements['group']

export const LocalAxes = ({
	direction = new THREE.Vector3(1, 1, 1),
	rotation = 0,
	yUp = false,
	scale = 1,
	label,
	...props
}: ILocalAxesProps): React.JSX.Element => {
	const axesRef = useRef<THREE.AxesHelper>(null)
	const groupRef = useRef<THREE.Group>(null)

	useEffect(() => {
		if (!axesRef.current) return

		// Origen of helper
		const pos = axesRef.current.position.clone()

		// Vector X local -> direction to the point
		const xDir = new THREE.Vector3().subVectors(direction, pos).normalize()

		const yDir = new THREE.Vector3()
		const zDir = new THREE.Vector3()
		if (yUp) {
			const yGlobal = new THREE.Vector3(0, 1, 0)

			// Z local = X × Y_global
			zDir.copy(new THREE.Vector3().crossVectors(xDir, yGlobal).normalize())

			// Y local adjusted = Z × X
			yDir.copy(new THREE.Vector3().crossVectors(zDir, xDir).normalize())
		} else {
			const zGlobal = new THREE.Vector3(0, 0, 1)

			// Y local = Z_global × X
			yDir.copy(new THREE.Vector3().crossVectors(zGlobal, xDir).normalize())

			// Z local adjusted = X × Y
			zDir.copy(new THREE.Vector3().crossVectors(xDir, yDir).normalize())
		}

		// Assemble rotation matrix
		const matrixRotation = new THREE.Matrix4()
		matrixRotation.makeBasis(xDir, yDir, zDir)

		// Apply to helper
		axesRef.current.setRotationFromMatrix(matrixRotation)

		// Rotation the helper around the axis
		groupRef.current?.rotateOnAxis(xDir, rotation)
	}, [direction, rotation, yUp])

	return (
		<group {...props}>
			<group ref={groupRef}>
				<Axes ref={axesRef} label={label} scale={scale} />
			</group>
		</group>
	)
}
