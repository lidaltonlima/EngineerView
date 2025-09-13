import { useEffect, useState } from 'react'
import { Default3dScene } from './components/3d'
import { Bar, DrawSupport, Node } from './components/3d/objects/structural/elements'
import { useStructureContext } from './contexts/Structure'
import { IStructureData } from './types/Structure'
import { DistributedLoad1D } from './components/3d/objects/structural/loads'
import { Vector3 } from 'three'
import { Line } from '@react-three/drei'

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

	const initialPoint = new Vector3(1, 1, 1)
	const finalPoint = new Vector3(1, 1, 3)

	return (
		<Default3dScene>
			{structureData?.bars.map((bar) => <Bar key={bar.name} bar={bar} />)}
			{structureData?.nodes.map((node) => <Node key={node.name} node={node} />)}
			{structureData?.supports.map((support) => DrawSupport(support, structure))}
			<axesHelper />
			<DistributedLoad1D
				name='Distributed Load'
				forceDirection='Fy'
				system='global'
				loads={[-3, 3]}
				xPositions={[0.5, 2]}
				barPoints={[initialPoint, finalPoint]}
			/>
			<Line points={[initialPoint, finalPoint]} color='orange' lineWidth={4} />
		</Default3dScene>
	)
}
