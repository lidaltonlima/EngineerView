import { Point, Points } from '@react-three/drei'
import { INodeData } from '@renderer/types/Structure'
import { Vector3 } from 'three'

interface INodeProps {
	node: INodeData
}

export const Node = ({ node }: INodeProps): React.JSX.Element => {
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
