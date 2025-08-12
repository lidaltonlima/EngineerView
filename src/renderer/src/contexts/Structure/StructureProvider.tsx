import { StructureContext } from './StructureContext'
import { IBarData, INodeData, IStructureData } from '@renderer/types/Structure'

interface StructureProviderProps {
	children: React.ReactNode
}

export const StructureProvider = ({ children }: StructureProviderProps): React.JSX.Element => {
	const nodes: INodeData[] = []
	const bars: IBarData[] = []
	const structure: IStructureData = { nodes, bars }

	return (
		<StructureContext.Provider
			value={{
				structure: structure
			}}
		>
			{children}
		</StructureContext.Provider>
	)
}
