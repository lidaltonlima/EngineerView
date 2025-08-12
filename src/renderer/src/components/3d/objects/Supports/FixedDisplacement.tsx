import { Line } from '@react-three/drei'
import { map2Plane1, map2Plane2, rotatePoints } from '../../utils/functions/transformPoints'

interface IFixedDisplacementProps {
	basePoint: [number, number, number]
	direction: 'Dx' | 'Dy' | 'Dz'
	scale?: number
}

export const FixedDisplacement = ({
	basePoint,
	direction,
	scale = 1
}: IFixedDisplacementProps): React.JSX.Element => {
	const size = 1 * scale
	const half = size / 2
	const height = (size * Math.sqrt(3)) / 2

	// Rotação para que o triângulo aponte para apontar para o sentido positivo do eixo
	let rotation = 0
	if (direction === 'Dx' || direction === 'Dy') {
		rotation = -Math.PI / 2
	}

	// Triângulo equilátero no plano XY
	const pointsXY = [
		[-half, -height / 3, 0], // canto esquerdo da base
		[half, -height / 3, 0], // canto direito da base
		[0, (2 * height) / 3, 0], // vértice oposto (topo)
		[-half, -height / 3, 0] // fecha o triângulo
	]

	// Line "floor"
	const base = size * 0.3
	const baseLineXY = [
		[-half - base / 2, -height / 3 - 0.1, 0],
		[half + base / 2, -height / 3 - 0.1, 0]
	]

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

	// First triangle /////////////////////////////////////////////////////////////////////////////
	let trianglePoints1 = map2Plane1(pointsXY, axis)
	let baseLinePoints1 = map2Plane1(baseLineXY, axis)

	const pivot = trianglePoints1[2]

	trianglePoints1 = trianglePoints1.map((point) => {
		return point.map((element, index) => element - pivot[index])
	})

	baseLinePoints1 = baseLinePoints1.map((point) => {
		return point.map((element, index) => element - pivot[index])
	})

	trianglePoints1 = rotatePoints(trianglePoints1, axis, rotation)
	baseLinePoints1 = rotatePoints(baseLinePoints1, axis, rotation)

	trianglePoints1 = trianglePoints1.map((point) => {
		return point.map((value, index) => value + basePoint[index])
	})

	baseLinePoints1 = baseLinePoints1.map((point) => {
		return point.map((value, index) => value + basePoint[index])
	})
	// Second triangle /////////////////////////////////////////////////////////////////////////////
	let trianglePoints2 = map2Plane2(pointsXY, axis)
	let baseLinePoints2 = map2Plane2(baseLineXY, axis)

	trianglePoints2 = trianglePoints2.map((point) => {
		return point.map((element, index) => element - pivot[index])
	})

	baseLinePoints2 = baseLinePoints2.map((point) => {
		return point.map((element, index) => element - pivot[index])
	})

	trianglePoints2 = rotatePoints(trianglePoints2, axis, rotation)
	baseLinePoints2 = rotatePoints(baseLinePoints2, axis, rotation)

	trianglePoints2 = trianglePoints2.map((point) => {
		return point.map((value, index) => value + basePoint[index])
	})

	baseLinePoints2 = baseLinePoints2.map((point) => {
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
			<Line worldUnits points={trianglePoints1.flat()} color={color} lineWidth={0.05} />
			<Line worldUnits points={baseLinePoints1.flat()} color={color} lineWidth={0.05} />
			<Line worldUnits points={trianglePoints2.flat()} color={color} lineWidth={0.05} />
			<Line worldUnits points={baseLinePoints2.flat()} color={color} lineWidth={0.05} />
		</>
	)
}
