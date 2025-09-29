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
					setResults(
						<div className={styles.main}>
							<fieldset>
								<legend>Node Results</legend>
								<p>Name: {selected.name}</p>
								<fieldset>
									<legend>Displacements</legend>
									<p>Dx: {results?.Dx.toExponential(4)}</p>
									<p>Dy: {results?.Dy.toExponential(4)}</p>
									<p>Dz: {results?.Dz.toExponential(4)}</p>
								</fieldset>
								<fieldset>
									<legend>Rotations</legend>
									<p>Rx: {results?.Rx.toExponential(4)}</p>
									<p>Ry: {results?.Ry.toExponential(4)}</p>
									<p>Rz: {results?.Rz.toExponential(4)}</p>
								</fieldset>
							</fieldset>
						</div>
					)
				} else if (selected.type == 'bar') {
					const results = structure.results
						.find((result) => result.load_case === 'L1')
						?.extreme_forces.find((force) => force.bar === selected.name)
					setResults(
						<div className={styles.main}>
							<fieldset>
								<legend>Bar Results</legend>
								<p>Bar: {results?.bar}</p>
								<fieldset>
									<legend>Initial Node</legend>
									<fieldset>
										<legend>Forces</legend>
										<p>Fx: {results?.Fxi.toExponential(4)}</p>
										<p>Fy: {results?.Fyi.toExponential(4)}</p>
										<p>Fz: {results?.Fzi.toExponential(4)}</p>
									</fieldset>
									<fieldset>
										<legend>Moments</legend>
										<p>Mx: {results?.Mxi.toExponential(4)}</p>
										<p>My: {results?.Myi.toExponential(4)}</p>
										<p>Mz: {results?.Mzi.toExponential(4)}</p>
									</fieldset>
								</fieldset>
								<fieldset>
									<legend>End Node</legend>
									<fieldset>
										<legend>Forces</legend>
										<p>Fx: {results?.Fxj.toExponential(4)}</p>
										<p>Fy: {results?.Fyj.toExponential(4)}</p>
										<p>Fz: {results?.Fzj.toExponential(4)}</p>
									</fieldset>
									<fieldset>
										<legend>Moments</legend>
										<p>Mx: {results?.Mxj.toExponential(4)}</p>
										<p>My: {results?.Myj.toExponential(4)}</p>
										<p>Mz: {results?.Mzj.toExponential(4)}</p>
									</fieldset>
								</fieldset>
							</fieldset>
						</div>
					)
				} else if (selected.type == 'support') {
					const results = structure.results
						.find((result) => result.load_case === 'L1')
						?.reactions.find((reaction) => reaction.node === selected.name)
					setResults(
						<div className={styles.main}>
							<fieldset>
								<legend>Support Results</legend>
								<p>Node: {results?.node}</p>
								<fieldset>
									<legend>Forces</legend>
									<p>Fx: {results?.Fx.toExponential(4)}</p>
									<p>Fy: {results?.Fy.toExponential(4)}</p>
									<p>Fz: {results?.Fz.toExponential(4)}</p>
								</fieldset>
								<fieldset>
									<legend>Moments</legend>
									<p>Mx: {results?.Mx.toExponential(4)}</p>
									<p>My: {results?.My.toExponential(4)}</p>
									<p>Mz: {results?.Mz.toExponential(4)}</p>
								</fieldset>
							</fieldset>
						</div>
					)
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
