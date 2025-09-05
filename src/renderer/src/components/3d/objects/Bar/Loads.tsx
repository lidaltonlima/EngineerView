import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { PointLoad } from '../PointLoad'

interface ILocalLoadsProps {
	direction: THREE.Vector3
	xPosition: number
	rotationAroundDirection?: number
	system?: 'global' | 'local'

	label?: boolean
	yUp?: boolean
}

type ILoadsProps = ILocalLoadsProps & React.JSX.IntrinsicElements['group']

export const Loads = ({
	direction,
	xPosition,
	rotationAroundDirection = 0,
	system = 'global',
	label = true,
	yUp = false,
	...props
}: ILoadsProps): React.JSX.Element => {
	const groupRef1 = useRef<THREE.AxesHelper>(null)
	const groupRef2 = useRef<THREE.Group>(null)

	useEffect(() => {
		if (!groupRef1.current) return

		// Origen of helper
		const pos = groupRef1.current.position.clone()

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
			if (direction.x == 0 && direction.y == 0) zGlobal.set(-1, 0, 0)

			// Y local = Z_global × X
			yDir.copy(new THREE.Vector3().crossVectors(zGlobal, xDir).normalize())

			// Z local adjusted = X × Y
			zDir.copy(new THREE.Vector3().crossVectors(xDir, yDir).normalize())
		}

		// Assemble rotation matrix
		const matrixRotation = new THREE.Matrix4()
		matrixRotation.makeBasis(xDir, yDir, zDir)

		// Apply to helper
		groupRef1.current.setRotationFromMatrix(matrixRotation)

		// Rotation the helper around the axis
		const rotation = direction.equals(new THREE.Vector3(0, 0, -1))
			? rotationAroundDirection + Math.PI
			: rotationAroundDirection
		groupRef2.current?.quaternion.setFromAxisAngle(xDir, rotation)
	}, [direction, rotationAroundDirection, yUp])

	return (
		<>
			{system === 'local' && (
				<group {...props}>
					<group ref={groupRef2}>
						<group ref={groupRef1}>
							<PointLoad
								label={label}
								position={new THREE.Vector3(xPosition, 0, 0)}
								fx={1}
								fy={2}
								fz={3}
								mx={4}
								my={5}
								mz={6}
							/>
						</group>
					</group>
				</group>
			)}
			{system === 'global' && (
				<group {...props}>
					<PointLoad
						label={label}
						position={direction.clone().multiplyScalar(xPosition)}
						fx={1}
						fy={2}
						fz={3}
						mx={4}
						my={5}
						mz={6}
					/>
				</group>
			)}
		</>
	)
}
