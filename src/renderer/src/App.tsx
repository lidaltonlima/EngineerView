import { useEffect, useState } from 'react'
import { Default3dScene } from './components/3d'
import { Bar, DrawSupport, Node } from './components/3d/objects/structural/elements'
import { useStructureContext } from './contexts/Structure'
import { IStructureData } from './types/Structure'
import { DistributedMoment } from './components/3d/objects/structural/loads/DistributedLoad1D/loadsStyle/DistributedMoment'
import { Vector3 } from 'three'

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
				structure.supports = data.supports
				structure.loads = data.loads
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
			{structureData?.supports.map((support) => DrawSupport(support, structure))}
			<axesHelper />
			<DistributedMoment
				name='Distributed Moment'
				forceDirection='My'
				loads={[-10, 10]}
				xPositions={[0, 1]}
				barPoints={[new Vector3(0, 0, 0), new Vector3(0, 1, 1)]}
			/>
		</Default3dScene>
	)
}
