import { Text, TextProps } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useState } from 'react'
import { Vector3 } from 'three'
import { BillboardAxis } from '../BillboardAxis'

interface IBillboardTextAxisCustomProps {
	axis: Vector3
	position?: [number, number, number] | Vector3
	anchorX?: 'left' | 'center' | 'right'
	anchorY?: 'top' | 'middle' | 'bottom'
	offsetX?: number
	offsetY?: number

	children: React.ReactNode
}

type IBillboardTextAxisProps = IBillboardTextAxisCustomProps &
	Omit<
		TextProps,
		'children' | 'rotation' | 'rotateX' | 'rotateY' | 'rotateZ' | 'anchorX' | 'anchorY' | 'position'
	>

export const BillboardTextAxis = ({
	axis,
	position = [0, 0, 0],
	offsetX = 0,
	offsetY = 0,
	anchorX = 'left',
	anchorY = 'bottom',
	children,
	...textProps
}: IBillboardTextAxisProps): React.JSX.Element => {
	const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0])
	const [anchor, setAnchor] = useState<'left' | 'center' | 'right'>(anchorX)
	const [textPosition, setTextPosition] = useState<[number, number, number]>([0, 0, 0])

	const { camera } = useThree()

	useFrame(() => {
		if (axis.x === 1 && axis.y === 0 && axis.z === 0) {
			if (camera.rotation.x > 0) {
				setTextPosition([
					offsetX * (anchorX === 'left' || anchorX === 'center' ? 1 : -1),
					offsetY,
					0
				])
				setRotation([0, 0, 0])
				switch (anchorX) {
					case 'left':
						setAnchor('left')
						break
					case 'right':
						setAnchor('right')
						break
				}
			} else {
				setTextPosition([
					offsetX * (anchorX === 'left' || anchorX === 'center' ? 1 : -1),
					-offsetY,
					0
				])
				setRotation([0, 0, Math.PI])
				switch (anchorX) {
					case 'left':
						setAnchor('right')
						break
					case 'right':
						setAnchor('left')
						break
				}
			}
		} else if (axis.x === 0 && axis.y === 1 && axis.z === 0) {
			if (camera.rotation.y > 0) {
				setTextPosition([
					-offsetY,
					offsetX * (anchorX === 'left' || anchorX === 'center' ? 1 : -1),
					0
				])
				setRotation([0, Math.PI, Math.PI / 2])
				switch (anchorX) {
					case 'left':
						setAnchor('left')
						break
					case 'right':
						setAnchor('right')
						break
				}
			} else {
				setTextPosition([
					offsetY,
					offsetX * (anchorX === 'left' || anchorX === 'center' ? 1 : -1),
					0
				])
				setRotation([0, Math.PI, -Math.PI / 2])
				switch (anchorX) {
					case 'left':
						setAnchor('right')
						break
					case 'right':
						setAnchor('left')
						break
				}
			}
		} else if (axis.x === 0 && axis.y === 0 && axis.z === 1) {
			setTextPosition([
				0,
				-offsetY,
				offsetX * (anchorX === 'left' || anchorX === 'center' ? 1 : -1)
			])
			setRotation([Math.PI / 2, Math.PI, Math.PI / 2])
		}
	})

	return (
		<BillboardAxis axis={axis} position={position}>
			<Text
				position={textPosition}
				rotation={rotation}
				anchorX={anchor}
				anchorY={anchorY}
				{...textProps}
			>
				{children}
			</Text>
		</BillboardAxis>
	)
}
