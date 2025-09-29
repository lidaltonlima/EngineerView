import { useSelectionContext } from '@renderer/contexts/Selection'
import { useStructureContext } from '@renderer/contexts/Structure'
import React, { useEffect, useState } from 'react'

export const Results = (): React.JSX.Element => {
	const { selection } = useSelectionContext()
	const { structure } = useStructureContext()
	const [results, setResults] = useState<React.JSX.Element>(<></>)

	useEffect(() => {
		if (selection[0].length === 0) {
			setResults(<p>Click on a entity to see results.</p>)
		} else {
			setResults(<p>RESULTS</p>)
		}
	}, [selection])

	if (structure.results === undefined || structure.results.length === 0) {
		return <p>No results available. Open a calculation structure.</p>
	} else {
		return results
	}
}
