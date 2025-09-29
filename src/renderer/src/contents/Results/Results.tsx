import { useSelectionContext } from '@renderer/contexts/Selection'
import { useStructureContext } from '@renderer/contexts/Structure'
import React, { useEffect, useState } from 'react'
import styles from './Results.module.scss'

export const Results = (): React.JSX.Element => {
	const { selection } = useSelectionContext()
	const { structure } = useStructureContext()
	const { clickVoid } = useSelectionContext()
	const [results, setResults] = useState<React.JSX.Element>(<></>)
	const isClickVoid = clickVoid[0]

	useEffect(() => {
		if (isClickVoid) {
			setResults(<p>Click on a entity to see results.</p>)
		} else {
			if (selection[0].length === 1) {
				const selected = selection[0][0]
				if (selected.type == 'node') {
					const results = structure.results
						.find((result) => result.load_case === 'L1')
						?.displacements.find((displacement) => displacement.node === selected.name)
					console.log(results)
					setResults(
						<div className={styles.main}>
							<fieldset>
								<legend>Node Results</legend>
								<p>Name: {selected.name}</p>
								<fieldset>
									<legend>Displacements</legend>
									<p>DX: {results?.Dx.toExponential(4)}</p>
									<p>DY: {results?.Dy.toExponential(4)}</p>
									<p>DZ: {results?.Dz.toExponential(4)}</p>
								</fieldset>
								<fieldset>
									<legend>Rotations</legend>
									<p>RX: {results?.Rx.toExponential(4)}</p>
									<p>RY: {results?.Ry.toExponential(4)}</p>
									<p>RZ: {results?.Rz.toExponential(4)}</p>
								</fieldset>
							</fieldset>
						</div>
					)
				} else if (selected.type == 'bar') {
					setResults(<p>Bar results to be implemented.</p>)
				} else if (selected.type == 'support') {
					setResults(<p>Support results to be implemented.</p>)
				}
			}
		}
	}, [selection, isClickVoid, structure])

	if (structure.results === undefined || structure.results.length === 0) {
		return <p>No results available. Open a calculation structure.</p>
	} else {
		return results
	}
}
