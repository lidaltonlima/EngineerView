import { useEffect, useState } from 'react'
import { Default3dScene } from './components/3d'
import { Node } from './components/3d/objects'
import { Bar } from './components/3d/objects/Bar'
import { DrawSupport } from './components/3d/utils'
import { useStructureContext } from './contexts/Structure'
import { IStructureData } from './types/Structure'
import { Hud, OrthographicCamera } from '@react-three/drei'

function MyCustomGizmo(): React.JSX.Element {
	return (
		<Hud renderPriority={1}>
			{/* Câmera do gizmo */}
			<OrthographicCamera makeDefault position={[0, 0, 5]} />
			<ambientLight intensity={1} />
			<mesh position={[1.5, -1.5, 0]}>
				<boxGeometry args={[0.5, 0.5, 0.5]} />
				<meshStandardMaterial color='orange' />
			</mesh>
		</Hud>
	)
}

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
			<MyCustomGizmo />
		</Default3dScene>
	)
}
