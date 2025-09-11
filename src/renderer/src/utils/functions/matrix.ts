export function multiply(A: number[][], B: number[][]): number[][] {
	const rowsA = A.length
	const colsA = A[0].length
	const colsB = B[0].length

	const result: number[][] = Array.from({ length: rowsA }, () => Array(colsB).fill(0))

	for (let i = 0; i < rowsA; i++) {
		for (let j = 0; j < colsB; j++) {
			for (let k = 0; k < colsA; k++) {
				result[i][j] += A[i][k] * B[k][j]
			}
		}
	}

	return result
}

export function trans(matriz: number[][]): number[][] {
	const linhas = matriz.length
	const colunas = matriz[0].length

	const resultado: number[][] = Array.from({ length: colunas }, () => Array(linhas).fill(0))

	for (let i = 0; i < linhas; i++) {
		for (let j = 0; j < colunas; j++) {
			resultado[j][i] = matriz[i][j]
		}
	}

	return resultado
}
