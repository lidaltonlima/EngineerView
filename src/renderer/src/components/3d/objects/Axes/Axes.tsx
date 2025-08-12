import { Billboard, Line, Text } from '@react-three/drei'

interface IAxesProps {
	position?: [number, number, number]
	rotation?: [number, number, number]
	scale?: number
	label?: boolean
}

export const Axes = ({
	position = [0, 0, 0],
	rotation = [0, 0, 0],
	scale = 1,
	label = false
}: IAxesProps): React.JSX.Element => {
	return (
		<group rotation={rotation} position={position} scale={scale}>
			<group rotation-x={Math.PI / 2}>
				<mesh position={[0, 1, 0]}>
					<coneGeometry args={[0.15, 0.5, 32]} />
					<meshBasicMaterial color={'blue'} />
				</mesh>
				<Line
					worldUnits
					points={[0, 0, 0, 0, 1, 0]}
					lineWidth={0.1 * scale}
					color={'blue'}
				/>
			</group>
			<group>
				<mesh position={[0, 1, 0]}>
					<coneGeometry args={[0.15, 0.5, 32]} />
					<meshBasicMaterial color={'green'} />
				</mesh>
				<Line
					worldUnits
					points={[0, 0, 0, 0, 1, 0]}
					lineWidth={0.1 * scale}
					color={'green'}
				/>
			</group>
			<group rotation-z={-Math.PI / 2}>
				<mesh position={[0, 1, 0]}>
					<coneGeometry args={[0.15, 0.5, 32]} />
					<meshBasicMaterial color={'red'} />
				</mesh>
				<Line
					worldUnits
					points={[0, 0, 0, 0, 1, 0]}
					lineWidth={0.1 * scale}
					color={'red'}
				/>
			</group>
			{label && (
				<>
					<Billboard position={[1.5, 0, 0]}>
						<Text fontSize={0.5} font={'/fonts/Inter-Bold.woff'}>
							X
						</Text>
					</Billboard>
					<Billboard position={[0, 1.5, 0]}>
						<Text fontSize={0.5} font={'/fonts/Inter-Bold.woff'}>
							Y
						</Text>
					</Billboard>
					<Billboard position={[0, 0, 1.5]}>
						<Text fontSize={0.5} font={'/fonts/Inter-Bold.woff'}>
							Z
						</Text>
					</Billboard>
				</>
			)}
		</group>
	)
}
