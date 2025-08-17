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
	const offsetLabel1 = 0.25
	const offsetLabel2 = 0.35
	const offsetNegativeLabel = 0.06
	switch (direction) {
		case 'x':
			billboardPosition.set(0, offsetLabel1, -offsetLabel2)
			break
		case 'y':
			billboardPosition.set(offsetLabel1, 0, offsetLabel2)
			break
		case 'z':
			rotationLabel = Math.PI / 2
			billboardPosition.set(-offsetLabel1, offsetLabel2 - 0.05, 0)
			break
		case '-x':
			billboardPosition.set(
				0,
				-offsetLabel1 - offsetNegativeLabel,
				offsetLabel2 - offsetNegativeLabel
			)
			break
		case '-y':
			anchorXLabel = 'right'
			billboardPosition.set(
				-offsetLabel1 - offsetNegativeLabel,
				0,
				-offsetLabel2 + offsetNegativeLabel
			)
			break
		case '-z':
			anchorXLabel = 'right'
			rotationLabel = Math.PI / 2
			billboardPosition.set(
				offsetLabel1 + offsetNegativeLabel,
				-offsetLabel2 + offsetNegativeLabel,
				0
			)
	}

	return (
		<>
			<CurvedArrow radius={0.4} color={arrowColor} direction={direction} scale={0.35} />
			{label && (
				<Billboard position={billboardPosition}>
					<Text
						rotation-z={rotationLabel}
						renderOrder={10}
						anchorX={anchorXLabel}
						font='/fonts/Inter-Regular.woff'
						fontSize={0.1}
					>
						{value.toString()}
						<meshBasicMaterial color={textColor} depthTest={false} />
					</Text>
				</Billboard>
			)}
		</>
	)
}
