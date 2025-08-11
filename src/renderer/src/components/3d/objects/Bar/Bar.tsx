import { Line } from '@react-three/drei'
import { useStructureContext } from '@renderer/contexts/Structure'
import { Vector3 } from 'three'

interface IBarProps {
	name: string
	startNode: string
	endNode: string
	color?: string
}

export const Bar = ({ name, startNode, endNode, color = 'red' }: IBarProps): React.JSX.Element => {
	const { nodes } = useStructureContext()

	const startPoint = new Vector3()
	const endPoint = new Vector3()

	for (const node of nodes) {
		if (node.name == startNode) {
			startPoint.set(node.position[0], node.position[1], node.position[2])
		} else if (node.name == endNode) {
			endPoint.set(node.position[0], node.position[1], node.position[2])
		}
	}

	return (
		<Line
			worldUnits
			name={name}
			points={[startPoint, endPoint]}
			color={color}
			lineWidth={0.1}
		/>
	)
}
