import { useEffect, useState } from 'react'
import { Default3dScene } from './components/3d'
import { Bar, NodalForce, Node } from './components/3d/objects'
import { DrawSupport } from './components/3d/utils'
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
			{structureData?.supports.map((support) => DrawSupport(support))}

			<NodalForce label fx={11111} fy={222222} fz={33333} mx={44444} my={55555} mz={66666} />
			<NodalForce
				label
				position={[3, 0, 0]}
				fx={-777777}
				fy={-8888888}
				fz={-9999999}
				mx={-1000000}
				my={-20000}
				mz={-30000}
			/>
		</Default3dScene>
	)
}
