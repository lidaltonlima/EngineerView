import { useEffect, useState } from 'react'
import { Default3dScene } from './components/3d'
import { Bar } from './components/3d/objects/Bar'
import { IBars, INodes, IStructure } from './types/Structure'
import { Point, Points } from '@react-three/drei'
import { Vector3 } from 'three'
import { useStructureContext } from './contexts/Structure'

export const App = (): React.JSX.Element => {
	const [bars, setBars] = useState<IBars[]>([])
	const [nodes, setNodes] = useState<INodes[]>([])
	const structure = useStructureContext()

	useEffect(() => {
		const disposeOpenFile = window.electron.ipcRenderer.on(
			'open-file',
			(_event, data: IStructure) => {
				setBars(data.bars)
				setNodes(data.nodes)
				structure.bars = data.bars
				structure.nodes = data.nodes
			}
		)

		return () => {
			disposeOpenFile()
		}
	}, [structure])

	const createNodes = (node: INodes): React.JSX.Element => {
		const position = new Vector3(node.position[0], node.position[1], node.position[2])

		return (
			<Points key={node.name} limit={1} range={1}>
				<pointsMaterial vertexColors size={0.5} />
				<Point
					name={node.name}
					position={position}
					color={'red'}
					onClick={(event) => console.log(event.object.name)}
				/>
			</Points>
		)
	}

	return (
		<Default3dScene>
			{bars.map((bar) => (
				<Bar
					key={bar.name}
					name={bar.name}
					color='blue'
					startNode={bar.start_node}
					endNode={bar.end_node}
				/>
			))}
			{nodes.map((node) => createNodes(node))}
		</Default3dScene>
	)
}
