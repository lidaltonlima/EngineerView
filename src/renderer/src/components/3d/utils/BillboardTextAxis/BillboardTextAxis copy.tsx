import { Text, TextProps } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

interface IBillboardTextAxisCustomProps {
	axis: 'x' | 'y' | 'z'
	anchorX?: 'left' | 'center' | 'right'
	anchorY?: 'top' | 'middle' | 'bottom'
	offsetX?: number
	offsetY?: number
	textColor?: string
}

type IBillboardTextAxisProps = IBillboardTextAxisCustomProps &
	Omit<
		TextProps,
		'children' | 'rotation' | 'rotateX' | 'rotateY' | 'rotateZ' | 'anchorX' | 'anchorY' | 'position'
	>

export const BillboardTextAxis = ({
	axis,
	textColor = 'white',
	anchorY = 'bottom',
	// offsetX = 0,
	// offsetY = 0,
	// anchorX = 'left',
	...textProps
}: IBillboardTextAxisProps): React.JSX.Element => {
	const rotationGroupRef = useRef<THREE.Group>(null!)
	const { camera } = useThree()

	// const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0])
	// const [position, setPosition] = useState<[number, number, number]>([0, 0, 0])
	// const [anchor, setAnchor] = useState<'left' | 'center' | 'right'>(anchorX)
	useFrame(() => {
		if (!rotationGroupRef.current) return

		// Camera direction in local coordinates
		const target = camera.position.clone()
		rotationGroupRef.current.parent?.localToWorld(rotationGroupRef.current.position.clone())
		const pos = rotationGroupRef.current.getWorldPosition(new THREE.Vector3())

		// Look at camera but only allow rotation around axis
		const look = new THREE.Vector3(
			axis === 'x' ? pos.x : target.x,
			axis === 'y' ? pos.y : target.y,
			axis === 'z' ? pos.z : target.z
		)
		rotationGroupRef.current.lookAt(look)

		// switch (axis) {
		// 	case 'x':
		// 		if (camera.rotation.x > 0) {
		// 			setPosition([offsetX, offsetY, 0])
		// 			setRotation([0, 0, 0])
		// 			setAnchor(anchorX === 'left' ? 'left' : anchorX === 'right' ? 'right' : 'center')
		// 		} else {
		// 			setPosition([offsetX, -offsetY, 0])
		// 			setRotation([0, 0, Math.PI])
		// 			setAnchor(anchorX === 'left' ? 'right' : anchorX === 'right' ? 'left' : 'center')
		// 		}
		// 		break
		// }
	})

	return (
		<group ref={rotationGroupRef}>
			<Text anchorX={'center'} anchorY={anchorY} {...textProps}>
				Test
				<meshBasicMaterial color={textColor || 'blue'} depthTest={false} />
			</Text>
		</group>
	)
}
