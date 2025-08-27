import { IReleasesData } from '@renderer/types/Structure'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RotationRelease } from './RotationRelease'
import { DisplacementRelease } from './DisplacementRelease'

interface IReleasesProps {
	releases: IReleasesData[]
	direction: THREE.Vector3
	startPoint: THREE.Vector3
	endPoint: THREE.Vector3
	barRotation: number
	rotate_releases: boolean
}

export const Releases = ({
	releases,
	direction,
	startPoint,
	endPoint,
	barRotation,
	rotate_releases
}: IReleasesProps): React.JSX.Element => {
	const groupStartRef = useRef<THREE.Group>(null)
	const groupEndRef = useRef<THREE.Group>(null)
	const directionGroupRef = useRef<THREE.Group>(null)
	const directionGroupAuxRef = useRef<THREE.Group>(null)

	const radius = 0.1
	const barLength = startPoint.distanceTo(endPoint)

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
		directionGroupAuxRef.current?.quaternion.setFromAxisAngle(
			xDir,
			rotate_releases ? barRotation : 0
		)
	}, [direction, barRotation, rotate_releases])

	return (
		<>
			<group position={startPoint}>
				<group ref={directionGroupAuxRef}>
					<group ref={directionGroupRef}>
						<group ref={groupStartRef} position-x={radius}>
							{releases.some((value) => value === 'Dxi') && <DisplacementRelease direction='x' />}
							{releases.some((value) => value === 'Dyi') && <DisplacementRelease direction='y' />}
							{releases.some((value) => value === 'Dzi') && <DisplacementRelease direction='z' />}
							{releases.some((value) => value === 'Rxi') && (
								<RotationRelease direction='x' radius={radius} />
							)}
							{releases.some((value) => value === 'Ryi') && (
								<RotationRelease direction='y' radius={radius} />
							)}
							{releases.some((value) => value === 'Rzi') && (
								<RotationRelease direction='z' radius={radius} />
							)}
						</group>
						<group ref={groupEndRef} position-x={barLength - radius}>
							{releases.some((value) => value === 'Dxj') && <DisplacementRelease direction='x' />}
							{releases.some((value) => value === 'Dyj') && <DisplacementRelease direction='y' />}
							{releases.some((value) => value === 'Dzj') && <DisplacementRelease direction='z' />}
							{releases.some((value) => value === 'Rxj') && (
								<RotationRelease direction='x' radius={radius} />
							)}
							{releases.some((value) => value === 'Ryj') && (
								<RotationRelease direction='y' radius={radius} />
							)}
							{releases.some((value) => value === 'Rzj') && (
								<RotationRelease direction='z' radius={radius} />
							)}
						</group>
					</group>
				</group>
			</group>
		</>
	)
}
