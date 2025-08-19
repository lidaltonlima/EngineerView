export function linSpace(start: number, end: number, space: number): number[] {
	if (space <= 0) {
		return []
	}
	if (space === 1) {
		return [start]
	}
	const result = new Array<number>(space)
	const step = (end - start) / (space - 1)
	for (let i = 0; i < space; i++) {
		result[i] = start + step * i
	}
	return result
}

// /**
//  * Convert degrees to radians.
//  * @param graus The value in degrees.
//  * @returns The value in radians.
//  */
// export function deg2Rad(graus: number): number {
// 	return graus * (Math.PI / 180)
// }
