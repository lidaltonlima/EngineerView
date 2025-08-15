import { Billboard, Text } from '@react-three/drei'
import { Vector3 } from 'three'
import { CurvedArrow } from '../CurvedArrow'

interface IMomentProps {
	direction: 'x' | 'y' | 'z' | '-x' | '-y' | '-z'
	value: number
	arrowColor?: string
	textColor?: string
	label?: boolean
}

export const Moment = ({
	direction,
	value,
	arrowColor = 'white',
	textColor = 'white',
	label = false
}: IMomentProps): React.JSX.Element => {
	const billboardPosition = new Vector3()
	let anchorXLabel: 'right' | 'left' = 'left'
	let rotationLabel = 0
	switch (direction) {
		case 'x':
			billboardPosition.set(0, 0.9, -1)
			break
		case 'y':
			billboardPosition.set(0.9, 0, 1.1)
			break
		case 'z':
			rotationLabel = Math.PI / 2
			billboardPosition.set(-0.9, 1.1, 0)
			break
		case '-x':
			billboardPosition.set(0, -0.9, 0.75)
			break
		case '-y':
			anchorXLabel = 'right'
			billboardPosition.set(-0.9, 0, -1.1)
			break
		case '-z':
			anchorXLabel = 'right'
			rotationLabel = Math.PI / 2
			billboardPosition.set(1, -0.8, 0)
	}

	return (
		<>
			<CurvedArrow radius={1.3} color={arrowColor} direction={direction} />
			{label && (
				<Billboard position={billboardPosition}>
					<Text
						rotation-z={rotationLabel}
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
