import { Text } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { BillboardAxis } from '../BillboardAxis'

interface IBillboardTextAxisProps {
	rotation?: THREE.Vector3 | [number, number, number]
}

export const TestText = ({
	rotation = [Math.PI / 2, 0, Math.PI / 2]
}: IBillboardTextAxisProps): React.JSX.Element => {
	const groupRef = useRef<THREE.Group>(null!)
	const textRef = useRef<THREE.Object3D>(null!)
	const { camera } = useThree()
	const textState: {
		direction: 'up' | 'down'
		facing: 'front' | 'back'
		isRotateDirection: boolean
		isRotationFacing: boolean
	} = {
		direction: 'up',
		facing: 'front',
		isRotateDirection: false,
		isRotationFacing: false
	}

	useFrame(() => {
		if (!groupRef.current) return

		// Get the text's up vector in world space
		const textUp = new THREE.Vector3(0, 1, 0).applyQuaternion(
			groupRef.current.getWorldQuaternion(new THREE.Quaternion())
		)

		// Get the camera's up vector in world space
		const cameraUpWorld = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion)

		// If the text "up" and the camera "up" point in opposite directions → it's upside down
		const dotUp = textUp.dot(cameraUpWorld)

		if (dotUp < 0) {
			textState.direction = 'down'
		} else {
			textState.direction = 'up'
		}

		// Get the text's forward vector in world space
		const textForward = new THREE.Vector3(0, 0, 1).applyQuaternion(
			groupRef.current.getWorldQuaternion(new THREE.Quaternion())
		)

		// Vector from text to camera
		const toCamera = camera.position
			.clone()
			.sub(groupRef.current.getWorldPosition(new THREE.Vector3()))
			.normalize()

		// If the text's forward vector points toward the camera, it's front; otherwise, it's back
		const dotForward = textForward.dot(toCamera)

		if (dotForward > 0) {
			textState.facing = 'front'
		} else {
			textState.facing = 'back'
		}
		// Rotation text to always face the camera
		if (textState.direction === 'down' && !textState.isRotateDirection) {
			textRef.current?.rotateZ(Math.PI)
			textState.isRotateDirection = true
		} else if (textState.direction === 'up' && textState.isRotateDirection) {
			textRef.current?.rotateZ(Math.PI)
			textState.isRotateDirection = false
		}

		if (textState.facing === 'back' && !textState.isRotationFacing) {
			textRef.current?.rotateY(Math.PI)
			textState.isRotationFacing = true
		} else if (textState.facing === 'front' && textState.isRotationFacing) {
			textRef.current?.rotateY(Math.PI)
			textState.isRotationFacing = false
		}
	})

	return (
		<BillboardAxis axis={new THREE.Vector3(0, 0, 1)} position={[1, 1, 1]}>
			<group
				ref={groupRef}
				rotation={Array.isArray(rotation) ? rotation : [rotation.x, rotation.y, rotation.z]}
			>
				<Text ref={textRef} font='/fonts/Inter-Regular.woff'>
					My Text
				</Text>
			</group>
		</BillboardAxis>
	)
}
