type Point = [number, number]

export function createLineFunction(p1: Point, p2: Point) {
	const [x1, y1] = p1
	const [x2, y2] = p2

	// Vertical line
	if (x1 === x2) throw new Error('Vertical line: y is not defined for every x.')

	const m = (y2 - y1) / (x2 - x1) // slope
	const b = y1 - m * x1 // y-intercept

	return (x: number) => m * x + b
}
