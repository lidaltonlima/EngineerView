import { useEffect, useState } from 'react'
import { Default3dScene } from './components/3d'
import { Bar } from './components/3d/objects/Bar'
import { IStructureData } from './types/Structure'
import { useStructureContext } from './contexts/Structure'
import { Node } from './components/3d/objects'

export const App = (): React.JSX.Element => {
	const [structureData, setStructureData] = useState<IStructureData | null>()
	const { structure } = useStructureContext()

	useEffect(() => {
		const disposeOpenFile = window.electron.ipcRenderer.on(
			'open-file',
			(_event, data: IStructureData) => {
				setStructureData(data)
				structure.nodes = data.nodes
				structure.bars = data.bars
			}
		)

		return () => {
			disposeOpenFile()
		}
	}, [structure])

	return (
		<Default3dScene>
			{structureData?.bars.map((bar) => <Bar key={bar.name} bar={bar} />)}
			{structureData?.nodes.map((node) => <Node key={node.name} node={node} />)}
		</Default3dScene>
	)
}
