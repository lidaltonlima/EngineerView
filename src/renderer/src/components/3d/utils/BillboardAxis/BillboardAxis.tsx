import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

interface IBillboardAxisCustomProps {
	children?: React.ReactNode
	axis: 'x' | 'y' | 'z'
}

type BillboardAxisProps = IBillboardAxisCustomProps & React.JSX.IntrinsicElements['group']

export const BillboardAxis = ({
	children,
	axis,
	...groupProps
}: BillboardAxisProps): React.JSX.Element => {
	const ref = useRef<THREE.Group>(null!)
	const { camera } = useThree()

	useFrame(() => {
		if (!ref.current) return

		const pos = ref.current.getWorldPosition(new THREE.Vector3())
		const dir = camera.position.clone().sub(pos)
		let angle = 0
		switch (axis) {
			case 'x':
				angle = Math.atan2(dir.y, dir.z)
				ref.current.rotation.set(-angle, 0, 0)
				break
			case 'y':
				angle = Math.atan2(dir.x, dir.z)
				ref.current.rotation.set(0, angle, 0)
				break
			case 'z':
				angle = Math.atan2(dir.y, dir.x)
				ref.current.rotation.set(0, 0, angle)
				break
		}
	})

	return (
		<group ref={ref} {...groupProps}>
			{children}
		</group>
	)
}
