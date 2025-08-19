import { Billboard, Line } from '@react-three/drei'

interface IFixedAllProps {
	color?: string
}

export const FixedAll = ({ color = 'magenta' }: IFixedAllProps): React.JSX.Element => {
	const size = 0.2
	const height = 0.15
	const rotationDistance = 0.1
	const linesAmount = 5
	const offset = (size / (linesAmount - 1)) * 2
	const lines: React.JSX.Element[] = []
	for (let i = 0; i < linesAmount; i++) {
		lines.push(
			<Line
				worldUnits
				points={[-size + i * offset, 0, 0, -size + i * offset - rotationDistance, -height, 0]}
				color={color}
				lineWidth={0.02}
			/>
		)
	}

	return (
		<Billboard>
			<Line worldUnits points={[-size, 0, 0, size, 0, 0]} color={color} lineWidth={0.02} />
			{lines}
		</Billboard>
	)
}
