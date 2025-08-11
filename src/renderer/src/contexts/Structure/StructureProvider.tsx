import { StructureContext } from './StructureContext'
import { IBars, INodes } from '@renderer/types/Structure'

interface StructureProviderProps {
	children: React.ReactNode
}

export const StructureProvider = ({ children }: StructureProviderProps): React.JSX.Element => {
	const bars: IBars[] = []
	const nodes: INodes[] = []

	return (
		<StructureContext.Provider
			value={{
				bars: bars,
				nodes: nodes
			}}
		>
			{children}
		</StructureContext.Provider>
	)
}
