import { Line } from '@react-three/drei'

interface IBarProps {
	name: string
	startNode: number[]
	endNode: number[]
	color?: string
}

export const Bar = ({
	name = '',
	startNode = [0, 0, 0],
	endNode = [1, 1, 1],
	color = 'red'
}: IBarProps): React.JSX.Element => {
	return (
		<Line
			worldUnits
			name={name}
			points={[...startNode, ...endNode]}
			color={color}
			lineWidth={0.1}
		/>
	)
}
