import { IReleasesData } from '@renderer/types/Structure'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RotationRelease } from './RotationRelease'
import { DisplacementRelease } from './DisplacementRelease'

interface IReleasesProps {
	releases: IReleasesData
	direction: THREE.Vector3
	startPoint: THREE.Vector3
	endPoint: THREE.Vector3
	barRotation: number
}

export const Releases = ({
	releases,
	direction,
	startPoint,
	endPoint,
	barRotation
}: IReleasesProps): React.JSX.Element => {
	const groupStartRef = useRef<THREE.Group>(null)
	const groupEndRef = useRef<THREE.Group>(null)
	const directionGroupRef = useRef<THREE.Group>(null)
	const directionGroupAuxRef = useRef<THREE.Group>(null)

	const radius = 0.1
	const barLength = startPoint.distanceTo(endPoint)
	const local = releases.system === 'local' ? true : false
	const startPosition = direction.clone().normalize().multiplyScalar(radius)
	const endPosition = direction
		.clone()
		.normalize()
		.multiplyScalar(barLength - radius)

	useEffect(() => {
		if (!directionGroupRef.current) return

		// Origen of helper
		const pos = directionGroupRef.current.position.clone()

		// Vector X local -> direction to the point
		const xDir = new THREE.Vector3().subVectors(direction, pos).normalize()

		const zGlobal = new THREE.Vector3(0, 0, 1)
		if (direction.x == 0 && direction.y == 0) zGlobal.set(-1, 0, 0)

		// Y local = Z_global × X
		const yDir = new THREE.Vector3().crossVectors(zGlobal, xDir).normalize()

		// Z local adjusted = X × Y
		const zDir = new THREE.Vector3().crossVectors(xDir, yDir).normalize()

		// Assemble rotation matrix
		const matrixRotation = new THREE.Matrix4()
		matrixRotation.makeBasis(xDir, yDir, zDir)

		// Apply to group
		directionGroupRef.current.setRotationFromMatrix(matrixRotation)

		// Rotation the group around the axis
		directionGroupAuxRef.current?.quaternion.setFromAxisAngle(xDir, barRotation)
	}, [direction, barRotation])

	return (
		<>
			{local && (
				<group ref={directionGroupAuxRef}>
					<group ref={directionGroupRef}>
						<group position={startPoint}>
							<group ref={groupStartRef} position-x={radius}>
								{releases.Dxi && <DisplacementRelease direction='x' />}
								{releases.Dxi && <DisplacementRelease direction='y' />}
								{releases.Dxi && <DisplacementRelease direction='z' />}
								{releases.Rxi && <RotationRelease direction='x' radius={radius} />}
								{releases.Ryi && <RotationRelease direction='y' radius={radius} />}
								{releases.Rzi && <RotationRelease direction='z' radius={radius} />}
							</group>
							<group ref={groupEndRef} position-x={barLength - radius}>
								{releases.Dxj && <DisplacementRelease direction='x' />}
								{releases.Dxj && <DisplacementRelease direction='y' />}
								{releases.Dxj && <DisplacementRelease direction='z' />}
								{releases.Rxj && <RotationRelease direction='x' radius={radius} />}
								{releases.Ryj && <RotationRelease direction='y' radius={radius} />}
								{releases.Rzj && <RotationRelease direction='z' radius={radius} />}
							</group>
						</group>
					</group>
				</group>
			)}
			{!local && (
				<>
					<group ref={groupStartRef} position={startPosition}>
						{releases.Dxi && <DisplacementRelease direction='x' />}
						{releases.Dxi && <DisplacementRelease direction='y' />}
						{releases.Dxi && <DisplacementRelease direction='z' />}
						{releases.Rxi && <RotationRelease direction='x' radius={radius} />}
						{releases.Ryi && <RotationRelease direction='y' radius={radius} />}
						{releases.Rzi && <RotationRelease direction='z' radius={radius} />}
					</group>
					<group ref={groupEndRef} position={endPosition}>
						{releases.Dxj && <DisplacementRelease direction='x' />}
						{releases.Dxj && <DisplacementRelease direction='y' />}
						{releases.Dxj && <DisplacementRelease direction='z' />}
						{releases.Rxj && <RotationRelease direction='x' radius={radius} />}
						{releases.Ryj && <RotationRelease direction='y' radius={radius} />}
						{releases.Rzj && <RotationRelease direction='z' radius={radius} />}
					</group>
				</>
			)}
		</>
	)
}
