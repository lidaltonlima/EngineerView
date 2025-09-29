import { useSelectionContext } from '@renderer/contexts/Selection'
import { useStructureContext } from '@renderer/contexts/Structure'
import React, { useEffect, useState } from 'react'

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
			setResults(<p>RESULTS</p>)
		}
	}, [selection, isClickVoid])

	if (structure.results === undefined || structure.results.length === 0) {
		return <p>No results available. Open a calculation structure.</p>
	} else {
		return results
	}
}
