import { Line } from '@react-three/drei'
import { linSpace } from '../../functions'

interface ICurvedArrowProps {
	radius?: number
	color?: string
	direction?: 'x' | '-x' | 'y' | '-y' | 'z' | '-z'
	scale?: number
	rotation?: [number, number, number]

	heightArrow?: number
	radiusArrow?: number
	lineWeight?: number

	endBase?: boolean
}

export const CurvedArrow = ({
	radius = 1,
	color = 'red',
	lineWeight = 0.08
}: ICurvedArrowProps): React.JSX.Element => {
	// Points of circle
	const anglesToLinePoints = linSpace(0, Math.PI * 2, 64)
	const linePoints = anglesToLinePoints.map((value) => [
		radius * Math.cos(value),
		radius * Math.sin(value),
		0
	])

	return (
		<>
			<Line worldUnits points={linePoints.flat()} lineWidth={lineWeight} color={color} />
		</>
	)
}
