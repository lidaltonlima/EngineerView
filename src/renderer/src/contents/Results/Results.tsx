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
		if (!(structure.results === undefined)) {
			if (isClickVoid) {
				setResults(<p>Click on a entity to see results.</p>)
			} else {
				if (selection[0].length === 1) {
					const selected = selection[0][0]
					if (selected.type == 'node') {
						const nodeResults = structure.results
							.find((result) => result.load_case === 'L1')
							?.displacements.find((displacement) => displacement.node === selected.name)
						setResults(
							<div className={styles.main}>
								<fieldset>
									<legend>Node Results</legend>
									<p>Name: {selected.name}</p>
									<fieldset>
										<legend>Displacements</legend>
										<p>Dx: {nodeResults?.Dx.toExponential(4)}</p>
										<p>Dy: {nodeResults?.Dy.toExponential(4)}</p>
										<p>Dz: {nodeResults?.Dz.toExponential(4)}</p>
									</fieldset>
									<fieldset>
										<legend>Rotations</legend>
										<p>Rx: {nodeResults?.Rx.toExponential(4)}</p>
										<p>Ry: {nodeResults?.Ry.toExponential(4)}</p>
										<p>Rz: {nodeResults?.Rz.toExponential(4)}</p>
									</fieldset>
								</fieldset>
							</div>
						)
					} else if (selected.type == 'bar') {
						const barResults = structure.results
							.find((result) => result.load_case === 'L1')
							?.extreme_forces.find((force) => force.bar === selected.name)
						setResults(
							<div className={styles.main}>
								<fieldset>
									<legend>Bar Results</legend>
									<p>Bar: {barResults?.bar}</p>
									<fieldset>
										<legend>Initial Node</legend>
										<fieldset>
											<legend>Forces</legend>
											<p>Fx: {barResults?.Fxi.toExponential(4)}</p>
											<p>Fy: {barResults?.Fyi.toExponential(4)}</p>
											<p>Fz: {barResults?.Fzi.toExponential(4)}</p>
										</fieldset>
										<fieldset>
											<legend>Moments</legend>
											<p>Mx: {barResults?.Mxi.toExponential(4)}</p>
											<p>My: {barResults?.Myi.toExponential(4)}</p>
											<p>Mz: {barResults?.Mzi.toExponential(4)}</p>
										</fieldset>
									</fieldset>
									<fieldset>
										<legend>End Node</legend>
										<fieldset>
											<legend>Forces</legend>
											<p>Fx: {barResults?.Fxj.toExponential(4)}</p>
											<p>Fy: {barResults?.Fyj.toExponential(4)}</p>
											<p>Fz: {barResults?.Fzj.toExponential(4)}</p>
										</fieldset>
										<fieldset>
											<legend>Moments</legend>
											<p>Mx: {barResults?.Mxj.toExponential(4)}</p>
											<p>My: {barResults?.Myj.toExponential(4)}</p>
											<p>Mz: {barResults?.Mzj.toExponential(4)}</p>
										</fieldset>
									</fieldset>
								</fieldset>
							</div>
						)
					} else if (selected.type == 'support') {
						const supportResults = structure.results
							.find((result) => result.load_case === 'L1')
							?.reactions.find((reaction) => reaction.node === selected.name)
						setResults(
							<div className={styles.main}>
								<fieldset>
									<legend>Support Results</legend>
									<p>Node: {supportResults?.node}</p>
									<fieldset>
										<legend>Forces</legend>
										<p>Fx: {supportResults?.Fx.toExponential(4)}</p>
										<p>Fy: {supportResults?.Fy.toExponential(4)}</p>
										<p>Fz: {supportResults?.Fz.toExponential(4)}</p>
									</fieldset>
									<fieldset>
										<legend>Moments</legend>
										<p>Mx: {supportResults?.Mx.toExponential(4)}</p>
										<p>My: {supportResults?.My.toExponential(4)}</p>
										<p>Mz: {supportResults?.Mz.toExponential(4)}</p>
									</fieldset>
								</fieldset>
							</div>
						)
					}
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
