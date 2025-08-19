import { useEffect, useRef } from 'react'
import { Arc } from '../Arc'
import * as THREE from 'three'
import { IReleasesData } from '@renderer/types/Structure'

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
	const length = startPoint.distanceTo(endPoint)
	const local = releases.system === 'local' ? true : false
	const startPosition = direction.clone().normalize().multiplyScalar(radius)
	const endPosition = direction
		.clone()
		.normalize()
		.multiplyScalar(length - radius)

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
								{releases.Rxi && (
									<Arc
										worldUnits
										rotation={[0, Math.PI / 2, Math.PI / 2]}
										radius={radius}
										color={'red'}
										lineWidth={0.01}
									/>
								)}
								{releases.Ryi && (
									<Arc
										worldUnits
										rotation={[Math.PI / 2, 0, Math.PI / 2]}
										radius={radius}
										color={'green'}
										lineWidth={0.01}
									/>
								)}
								{releases.Rzi && (
									<Arc
										worldUnits
										radius={radius}
										color={'blue'}
										lineWidth={0.01}
									/>
								)}
							</group>
							<group ref={groupEndRef} position-x={length - radius}>
								{releases.Rxj && (
									<Arc
										worldUnits
										rotation={[0, Math.PI / 2, Math.PI / 2]}
										radius={radius}
										color={'red'}
										lineWidth={0.01}
									/>
								)}
								{releases.Ryj && (
									<Arc
										worldUnits
										rotation={[Math.PI / 2, 0, Math.PI / 2]}
										radius={radius}
										color={'green'}
										lineWidth={0.01}
									/>
								)}
								{releases.Rzj && (
									<Arc
										worldUnits
										radius={radius}
										color={'blue'}
										lineWidth={0.01}
									/>
								)}
							</group>
						</group>
					</group>
				</group>
			)}
			{!local && (
				<>
					<group ref={groupStartRef} position={startPosition}>
						{releases.Rxi && (
							<Arc
								worldUnits
								rotation={[0, Math.PI / 2, Math.PI / 2]}
								radius={radius}
								color={'red'}
								lineWidth={0.01}
							/>
						)}
						{releases.Ryi && (
							<Arc
								worldUnits
								rotation={[Math.PI / 2, 0, Math.PI / 2]}
								radius={radius}
								color={'green'}
								lineWidth={0.01}
							/>
						)}
						{releases.Rzi && (
							<Arc worldUnits radius={radius} color={'blue'} lineWidth={0.01} />
						)}
					</group>
					<group ref={groupEndRef} position={endPosition}>
						{releases.Rxj && (
							<Arc
								worldUnits
								rotation={[0, Math.PI / 2, Math.PI / 2]}
								radius={radius}
								color={'red'}
								lineWidth={0.01}
							/>
						)}
						{releases.Ryj && (
							<Arc
								worldUnits
								rotation={[Math.PI / 2, 0, Math.PI / 2]}
								radius={radius}
								color={'green'}
								lineWidth={0.01}
							/>
						)}
						{releases.Rzj && (
							<Arc worldUnits radius={radius} color={'blue'} lineWidth={0.01} />
						)}
					</group>
				</>
			)}
		</>
	)
}
