export function linSpace(start: number, end: number, quantity: number): number[] {
	if (quantity <= 0) {
		return []
	}
	if (quantity === 1) {
		return [start]
	}
	const result = new Array<number>(quantity)
	const step = (end - start) / (quantity - 1)
	for (let i = 0; i < quantity; i++) {
		result[i] = start + step * i
	}
	return result
}
