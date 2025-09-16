import { Text } from '@react-three/drei'
import { useEffect, useState } from 'react'
import { Default3dScene } from './components/3d'
import { Bar, DrawSupport, Node } from './components/3d/objects/structural/elements'
import { BillboardAxis } from './components/3d/utils'
import { useStructureContext } from './contexts/Structure'
import { IStructureData } from './types/Structure'

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
			<group rotation={[0, Math.PI / 2, 0]}>
				<BillboardAxis axis='x'>
					<Text
						font='/fonts/Inter-Regular.woff'
						position={[1, 0, 0]}
						color='red'
						anchorX='left'
						anchorY='middle'
					>
						My text
					</Text>
				</BillboardAxis>
			</group>
		</Default3dScene>
	)
}
