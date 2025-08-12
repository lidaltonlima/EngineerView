import { Line } from '@react-three/drei'
import { map2Plane, rotatePoints } from '../../utils/functions/transformPoints'

interface ISpringRotationProps {
	basePoint: [number, number, number]
	direction: 'Rx' | 'Ry' | 'Rz'
	scale?: number
}

export const SpringRotation = ({
	basePoint,
	direction,
	scale = 1
}: ISpringRotationProps): React.JSX.Element => {
	const size = 0.5 * scale

	let pointsLine = [
		[0, 0, 0],
		[size, 0, 0]
	]

	const pointsNumber = 100
	const initialRadius = 0.0001
	const endRadius = size
	const lapsNumber = 3

	const theta = linSpace(0, 2 * Math.PI * lapsNumber, pointsNumber)
	const raio = linSpace(initialRadius, endRadius, pointsNumber)

	let pointsSpiral: number[][] = []
	for (let i = 0; i < pointsNumber; i++) {
		// Coordenada X é fixa para cada ponto da espiral
		const x = size
		// Coordenadas Y e Z calculadas com base no raio e ângulo
		const y = raio[i] * Math.cos(theta[i])
		const z = raio[i] * Math.sin(theta[i])
		// Adiciona o novo ponto ao array
		pointsSpiral.push([x, y, z])
	}

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

	pointsSpiral = rotatePoints(map2Plane(pointsSpiral, axis), axis, rotation)
	pointsSpiral = pointsSpiral.map((point) => {
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
			<Line worldUnits points={pointsSpiral.flat()} color={color} lineWidth={0.05} />
		</>
	)
}

function linSpace(start: number, end: number, num: number): number[] {
	if (num <= 0) {
		return []
	}
	if (num === 1) {
		return [start]
	}
	const result = new Array<number>(num)
	const step = (end - start) / (num - 1)
	for (let i = 0; i < num; i++) {
		result[i] = start + step * i
	}
	return result
}
