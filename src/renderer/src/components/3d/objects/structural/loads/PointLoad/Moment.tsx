import { Billboard, Text } from '@react-three/drei'
import { Vector3 } from 'three'
import { CurvedArrow } from '../../../CurvedArrow'

interface IMomentCustomProps {
	direction: 'x' | 'y' | 'z' | '-x' | '-y' | '-z'
	value: number
	radius?: number
	scale?: number
	arrowColor?: string
	labelColor?: string

	label?: boolean
}

type IMomentProps = IMomentCustomProps & React.JSX.IntrinsicElements['group']

export const Moment = ({
	direction,
	value,
	radius = 0.4,
	scale = 0.35,
	arrowColor = 'white',
	labelColor = 'white',
	label = false,
	...props
}: IMomentProps): React.JSX.Element => {
	const billboardPosition = new Vector3()
	let anchorXLabel: 'right' | 'left' = 'left'
	let rotationLabel = 0
	const offsetLabel1 = 0.25 * (radius / 0.4)
	const offsetLabel2 = 0.35 * (radius / 0.4)
	const offsetNegativeLabel = 0.06 * (radius / 0.4)
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
		<group {...props}>
			<CurvedArrow radius={radius} color={arrowColor} direction={direction} scale={scale} />
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
						<meshBasicMaterial color={labelColor} depthTest={false} />
					</Text>
				</Billboard>
			)}
		</group>
	)
}
