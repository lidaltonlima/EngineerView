import { Billboard, Text } from '@react-three/drei'
import { Arrow } from '../Arrow'
import { Vector3 } from 'three'

interface IForceProps {
	direction: 'x' | 'y' | 'z' | '-x' | '-y' | '-z'
	value: number
	arrowColor?: string
	textColor?: string
	label?: boolean
}

export const Force = ({
	direction,
	value,
	arrowColor = 'white',
	textColor = 'white',
	label = false
}: IForceProps): React.JSX.Element => {
	const billboardPosition = new Vector3()
	let anchorXLabel: 'right' | 'left' = 'left'
	let labelRotation = 0
	switch (direction) {
		case 'x':
			anchorXLabel = 'right'
			billboardPosition.set(-1.1, 0, 0)
			break
		case 'y':
			billboardPosition.set(0, -1.1, 0)
			break
		case 'z':
			anchorXLabel = 'right'
			labelRotation = Math.PI / 2
			billboardPosition.set(0, 0, -1.1)
			break
		case '-x':
			billboardPosition.set(1.1, 0, 0)
			break
		case '-y':
			billboardPosition.set(0, 1.1, 0)
			break
		case '-z':
			labelRotation = Math.PI / 2
			billboardPosition.set(0, 0, 1.1)
	}

	return (
		<>
			<Arrow renderOrder={9} endBase color={arrowColor} direction={direction} />
			{label && (
				<Billboard position={billboardPosition}>
					<Text
						rotation-z={labelRotation}
						renderOrder={10}
						anchorX={anchorXLabel}
						font='/fonts/Inter-Regular.woff'
						fontSize={0.3}
					>
						{value.toString()}
						<meshBasicMaterial color={textColor} depthTest={false} />
					</Text>
				</Billboard>
			)}
		</>
	)
}
