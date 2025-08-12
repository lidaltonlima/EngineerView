import { Line } from '@react-three/drei'
import { map2Plane, rotatePoints } from '../../utils/functions/transformPoints'

interface IFixedRotationProps {
	basePoint: [number, number, number]
	direction: 'Rx' | 'Ry' | 'Rz'
	scale?: number
}

export const FixedRotation = ({
	basePoint,
	direction,
	scale = 1
}: IFixedRotationProps): React.JSX.Element => {
	const size = 0.5 * scale
	let pointsLine = [
		[0.0, 0.0, 0.0],
		[2 * size, 0.0, 0.0]
	]

	let pointsSquare = [
		[2 * size, size, size],
		[2 * size, -size, size],
		[2 * size, -size, -size],
		[2 * size, size, -size],
		[2 * size, size, size]
	]

	let rotation: number
	if (direction === 'Rx' || direction === 'Ry') {
		rotation = 0
	} else {
		rotation = -Math.PI / 2
	}

	// Axis of displacement
	let axis: 'x' | 'y' | 'z'
	switch (direction) {
		case 'Rx':
			axis = 'x'
			break
		case 'Ry':
			axis = 'y'
			break
		case 'Rz':
			axis = 'z'
	}

	pointsLine = rotatePoints(map2Plane(pointsLine, axis), axis, rotation)
	pointsLine = pointsLine.map((point) => {
		return point.map((value, index) => value + basePoint[index])
	})
	pointsSquare = rotatePoints(map2Plane(pointsSquare, axis), axis, rotation)
	pointsSquare = pointsSquare.map((point) => {
		return point.map((value, index) => value + basePoint[index])
	})

	// Style //////////////////////////////////////////////////////////////////////////////////////
	let color: string
	switch (direction) {
		case 'Rx':
			color = 'red'
			break
		case 'Ry':
			color = 'green'
			break
		case 'Rz':
			color = 'blue'
	}

	return (
		<>
			<Line worldUnits points={pointsLine.flat()} color={color} lineWidth={0.05} />
			<Line worldUnits points={pointsSquare.flat()} color={color} lineWidth={0.05} />
		</>
	)
}
