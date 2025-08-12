export const map2Plane = (points: number[][], axis: 'x' | 'y' | 'z'): number[][] => {
	if (axis === 'x') {
		return points
	} else if (axis == 'y') {
		const newPoints = points.map((point) => {
			return [point[2], point[0], point[1]]
		})
		return newPoints
	} else {
		const newPoints = points.map((point) => {
			return [point[0], point[2], point[1]]
		})
		return newPoints
	}
}

export const rotatePoints = (
	points: number[][],
	axis: 'x' | 'y' | 'z',
	rotation: number
): number[][] => {
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
