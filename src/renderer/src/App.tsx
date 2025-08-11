import { useEffect, useState } from 'react'
import { Default3dScene } from './components/3d'
import { Bar } from './components/3d/objects/Bar'
import { IBars, INodes } from './types/Structure'
import { Point, Points } from '@react-three/drei'
import { Vector3 } from 'three'

export const App = (): React.JSX.Element => {
	const [bars, setBars] = useState<IBars[]>([])
	const [nodes, setNodes] = useState<INodes[]>([])

	useEffect(() => {
		const disposeOpenFile = window.electron.ipcRenderer.on('open-file', (_event, data) => {
			setBars(data.bars)
			setNodes(data.nodes)
		})

		return () => {
			disposeOpenFile()
		}
	}, [])

	const createBars = (bar: IBars): React.JSX.Element | null => {
		let startPoint: number[] | undefined
		let endPoint: number[] | undefined

		for (const node of nodes) {
			if (node.name == bar.start_node) {
				startPoint = node.position
			} else if (node.name == bar.end_node) {
				endPoint = node.position
			}
		}

		if (startPoint && endPoint) {
			return (
				<Bar
					key={bar.name}
					name={bar.name}
					color='blue'
					startNode={startPoint}
					endNode={endPoint}
				/>
			)
		}

		return null
	}

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
			{bars.map((bar) => createBars(bar))}
			{nodes.map((node) => createNodes(node))}
		</Default3dScene>
	)
}
