import { Billboard, Text } from '@react-three/drei'
import { Arrow } from '../Arrow'

interface IAxesProps {
	position?: [number, number, number]
	rotation?: [number, number, number]
	scale?: number
	label?: boolean
}

// const initialPoint = new Vector3(0, 0, 0)
// const endPoint = new Vector3(1, 1, 1)
// const direction = new Vector3()
// direction.subVectors(endPoint, initialPoint)

// const from = new Vector3(1, 0, 0) // eixo X
// const to = direction.clone().normalize() // normaliza o vetor de destino
// const quaternion = new Quaternion().setFromUnitVectors(from, to)

export const Axes = ({
	position = [0, 0, 0],
	rotation = [0, 0, 0],
	scale = 1,
	label = true
}: IAxesProps): React.JSX.Element => {
	return (
		<group rotation={rotation} position={position} scale={scale}>
			<Arrow />
			<Arrow direction='y' color='green' />
			<Arrow direction='z' color='blue' />
			{label && (
				<>
					<Billboard position={[1.2, 0, 0]}>
						<Text fontSize={0.4} font={'/fonts/Inter-Bold.woff'}>
							X
						</Text>
					</Billboard>
					<Billboard position={[0, 1.2, 0]}>
						<Text fontSize={0.4} font={'/fonts/Inter-Bold.woff'}>
							Y
						</Text>
					</Billboard>
					<Billboard position={[0, 0, 1.2]}>
						<Text fontSize={0.4} font={'/fonts/Inter-Bold.woff'}>
							Z
						</Text>
					</Billboard>
				</>
			)}
		</group>
	)
}
