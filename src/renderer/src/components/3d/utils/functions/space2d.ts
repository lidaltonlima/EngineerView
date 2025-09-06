type Point = [number, number]

export function createLinearFunction(p1: Point, p2: Point) {
	const [x1, y1] = p1
	const [x2, y2] = p2

	// Vertical line
	if (x1 === x2) throw new Error('Vertical line: y is not defined for every x.')

	const m = (y2 - y1) / (x2 - x1) // slope
	const b = y1 - m * x1 // y-intercept

	return (x: number) => m * x + b
}

export function rootLinear(point1: Point, point2: Point): number {
	/** Calculate the root (x-intercept) of the line defined by two points in 2D space.
	 *
	 * Args:
	 *     point_1 (Tuple[float, float]): Initial point (x1, y1)
	 *     point_2 (Tuple[float, float]): End point (x2, y2)
	 *
	 * Throws:
	 *     Error: If the line is vertical or horizontal and does not cross the x-axis.
	 *
	 * Returns:
	 *     number: The x-coordinate where the line crosses the x-axis.
	 */

	const [x1, y1] = point1
	const [x2, y2] = point2

	if (x1 === x2) {
		// If the points have the same x coordinate, the line is vertical.
		// A vertical line does not cross the x-axis at a finite point.
		throw new Error('Vertical line. No finite root.')
	}

	if (y1 === y2) {
		// If the points have the same y coordinate, the line is horizontal.
		if (y1 === 0) {
			// A horizontal line either lies on the x-axis (if y1 == 0)
			throw new Error('The line lies on the x-axis. Infinite roots.')
		} else {
			// A horizontal line above or below the x-axis does not cross it.
			throw new Error('Horizontal line. No root.')
		}
	}

	// Calculate the slope (m)
	const m = (y2 - y1) / (x2 - x1)
	// Calculate the y-intercept (c)
	const c = y1 - m * x1
	// Calculate the root (x when y=0)
	const root = -c / m

	return root
}
