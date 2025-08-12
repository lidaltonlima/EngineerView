import { Line } from '@react-three/drei'
import { useStructureContext } from '@renderer/contexts/Structure'
import { IBarData } from '@renderer/types/Structure'
import { Vector3 } from 'three'

interface IBarProps {
	bar: IBarData
}

export const Bar = ({ bar }: IBarProps): React.JSX.Element => {
	const { structure } = useStructureContext()

	const startPoint = new Vector3()
	const endPoint = new Vector3()

	for (const node of structure.nodes) {
		if (node.name == bar.start_node) {
			startPoint.set(node.position[0], node.position[1], node.position[2])
		} else if (node.name == bar.end_node) {
			endPoint.set(node.position[0], node.position[1], node.position[2])
		}
	}

	return (
		<Line
			worldUnits
			name={bar.name}
			points={[startPoint, endPoint]}
			color={'orange'}
			lineWidth={0.1}
		/>
	)
}
