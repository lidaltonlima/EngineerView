import { Line } from '@react-three/drei'
import { map2Plane, rotatePoints } from '../../utils/functions/transformPoints'

interface ISpringDisplacement {
	basePoint: [number, number, number]
	direction: 'Dx' | 'Dy' | 'Dz'
	scale?: number
}

export const SpringDisplacement = ({
	basePoint,
	direction,
	scale = 1
}: ISpringDisplacement): React.JSX.Element => {
	const size = 0.3 * scale
	const points_base = [
		[0.0, 0.0, 0.0],
		[size, size, 0.0],
		[2 * size, -size, 0.0],
		[3 * size, size, 0.0],
		[4 * size, -size, 0.0],
		[5 * size, size, 0.0],
		[6 * size, -size, 0.0],
		[7 * size, 0.0, 0.0],
		[7 * size, 2 * size, 0.0],
		[7 * size, -2 * size, 0.0]
	]

	let rotation: number
	if (direction === 'Dx' || direction === 'Dy') {
		rotation = Math.PI
	} else {
		rotation = Math.PI / 2
	}

	// Axis of displacement
	let axis: 'x' | 'y' | 'z'
	switch (direction) {
		case 'Dx':
			axis = 'x'
			break
		case 'Dy':
			axis = 'y'
			break
		case 'Dz':
			axis = 'z'
	}

	let points = rotatePoints(map2Plane(points_base, axis), axis, rotation)
	points = points.map((point) => {
		return point.map((value, index) => value + basePoint[index])
	})

	// Style //////////////////////////////////////////////////////////////////////////////////////
	let color: string
	switch (direction) {
		case 'Dx':
			color = 'red'
			break
		case 'Dy':
			color = 'green'
			break
		case 'Dz':
			color = 'blue'
	}

	return (
		<>
			<Line worldUnits points={points.flat()} color={color} lineWidth={0.05} />
		</>
	)
}
