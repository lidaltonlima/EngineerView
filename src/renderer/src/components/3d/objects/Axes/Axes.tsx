import { Billboard, Line, Text } from '@react-three/drei'

interface IAxesCustomProps {
	label?: boolean
	scale?: number
	color?: string
}

type IAxesProps = IAxesCustomProps & React.JSX.IntrinsicElements['group']

export const Axes = ({
	label = false,
	scale = 1,
	color = 'white',
	...props
}: IAxesProps): React.JSX.Element => {
	return (
		<group {...props} scale={scale}>
			<Line worldUnits points={[0, 0, 0, 1, 0, 0]} lineWidth={0.1 * scale} color={'red'} />
			<Line worldUnits points={[0, 0, 0, 0, 1, 0]} lineWidth={0.1 * scale} color={'green'} />
			<Line worldUnits points={[0, 0, 0, 0, 0, 1]} lineWidth={0.1 * scale} color={'blue'} />
			{label && (
				<>
					<Billboard position={[1.3, 0, 0]}>
						<Text fontSize={0.4} font={'/fonts/Inter-Bold.woff'}>
							X
							<meshBasicMaterial depthTest={false} color={color} />
						</Text>
					</Billboard>
					<Billboard position={[0, 1.3, 0]}>
						<Text fontSize={0.4} font={'/fonts/Inter-Bold.woff'}>
							Y
							<meshBasicMaterial depthTest={false} color={color} />
						</Text>
					</Billboard>
					<Billboard position={[0, 0, 1.3]}>
						<Text fontSize={0.4} font={'/fonts/Inter-Bold.woff'}>
							Z
							<meshBasicMaterial depthTest={false} color={color} />
						</Text>
					</Billboard>
				</>
			)}
		</group>
	)
}
