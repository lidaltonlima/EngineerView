import { Line } from '@react-three/drei'

interface IFixedDisplacementProps {
	basePoint: [number, number, number]
	axis: 'x' | 'y' | 'z'
	scale?: number
}

export const FixedDisplacement = ({
	basePoint,
	axis,
	scale = 1
}: IFixedDisplacementProps): React.JSX.Element => {
	const size = 1 * scale
	const half = size / 2
	const height = (size * Math.sqrt(3)) / 2

	// Rotação para apontar para o sentido positivo
	let rotation = 0
	switch (axis) {
		case 'x':
		case 'y':
			rotation = -Math.PI / 2
			break
		case 'z':
			rotation = 0
			break
	}

	// Triângulo equilátero no plano XY com base centrada na origem e vértice oposto em cima
	const points_xy = [
		[-half, -height / 3, 0], // canto esquerdo da base
		[half, -height / 3, 0], // canto direito da base
		[0, (2 * height) / 3, 0], // vértice oposto (topo)
		[-half, -height / 3, 0] // fecha o triângulo
	]

	// Linha "chão"
	const base = size * 0.3 // 30% maior que a base
	const base_line_xy = [
		[-half - base / 2, -height / 3 - 0.1, 0], // um pouco abaixo da base
		[half + base / 2, -height / 3 - 0.1, 0]
	]

	let tri_pts = map2Plane(points_xy, axis)
	let base_line_pts = map2Plane(base_line_xy, axis)

	const pivot = tri_pts[2]

	tri_pts = tri_pts.map((point) => {
		return point.map((element, index) => element - pivot[index])
	})

	base_line_pts = base_line_pts.map((point) => {
		return point.map((element, index) => element - pivot[index])
	})

	tri_pts = rotatePoints(tri_pts, axis, rotation)
	base_line_pts = rotatePoints(base_line_pts, axis, rotation)

	tri_pts = tri_pts.map((point) => {
		return point.map((value, index) => value + basePoint[index])
	})

	base_line_pts = base_line_pts.map((point) => {
		return point.map((value, index) => value + basePoint[index])
	})

	let color: string
	switch (axis) {
		case 'x':
			color = 'red'
			break
		case 'y':
			color = 'green'
			break
		case 'z':
			color = 'blue'
	}

	return (
		<>
			<Line worldUnits points={tri_pts.flat()} color={color} lineWidth={0.05} />
			<Line worldUnits points={base_line_pts.flat()} color={color} lineWidth={0.05} />
		</>
	)
}

const map2Plane = (points: number[][], axis: 'x' | 'y' | 'z'): number[][] => {
	if (axis === 'x') {
		return points
	} else if (axis == 'y') {
		const newPoints = points.map((point) => {
			return [point[0], point[2], point[1]]
		})
		return newPoints
	} else {
		const newPoints = points.map((point) => {
			return [point[2], point[0], point[1]]
		})
		return newPoints
	}
}

const rotatePoints = (points: number[][], axis: 'x' | 'y' | 'z', rotation: number): number[][] => {
	const perpendicular_axis = { x: 2, z: 1, y: 0 }
	const pts_rot = points
	points.map((point, index) => {
		// Componentes do plano
		const v1 = (perpendicular_axis[axis] + 1) % 3
		const v2 = (perpendicular_axis[axis] + 2) % 3
		const [x, y] = [point[v1], point[v2]]

		const x_new = Math.cos(rotation) * x - Math.sin(rotation) * y
		const y_new = Math.sin(rotation) * x + Math.cos(rotation) * y
		pts_rot[index][v1] = x_new
		pts_rot[index][v2] = y_new
	})

	return pts_rot
}
