import { BillboardTextAxis } from '@renderer/components/3d/utils'
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
	const labelDirection = new Vector3(0, 0, 0)
	const offsetLabel1 = 0.28 * (radius / 0.4)
	const offsetLabel2 = 0.3 * (radius / 0.4)
	const offsetNegativeLabel = 0.03 * (radius / 0.4)
	switch (direction) {
		case 'x':
			labelDirection.set(1, 0, 0)
			billboardPosition.set(0, offsetLabel1, -offsetLabel2)
			break
		case 'y':
			billboardPosition.set(offsetLabel1, 0, offsetLabel2)
			labelDirection.set(0, 1, 0)
			break
		case 'z':
			labelDirection.set(0, 0, 1)
			billboardPosition.set(-offsetLabel1, offsetLabel2, 0)
			break
		case '-x':
			labelDirection.set(1, 0, 0)
			anchorXLabel = 'right'
			billboardPosition.set(0, -offsetLabel1, offsetLabel2 - offsetNegativeLabel)
			break
		case '-y':
			labelDirection.set(0, 1, 0)
			anchorXLabel = 'right'
			billboardPosition.set(-offsetLabel1, 0, -offsetLabel2 + offsetNegativeLabel)
			break
		case '-z':
			labelDirection.set(0, 0, 1)
			anchorXLabel = 'right'
			billboardPosition.set(offsetLabel1, -offsetLabel2 + offsetNegativeLabel, 0)
	}

	return (
		<group {...props}>
			<CurvedArrow radius={radius} color={arrowColor} direction={direction} scale={scale} />
			{label && (
				// <Billboard position={billboardPosition}>
				// 	<Text
				// 		rotation-z={rotationLabel}
				// 		renderOrder={10}
				// 		anchorX={anchorXLabel}
				// 		font='/fonts/Inter-Regular.woff'
				// 		fontSize={0.1}
				// 	>
				// 		{value.toString()}
				// 		<meshBasicMaterial color={labelColor} depthTest={false} />
				// 	</Text>
				// </Billboard>
				<BillboardTextAxis
					axis={labelDirection}
					position={billboardPosition}
					offsetX={0.03}
					anchorX={anchorXLabel}
					anchorY='middle'
					font='/fonts/Inter-Regular.woff'
					fontSize={0.1}
					color={labelColor}
				>
					{value.toString()}
				</BillboardTextAxis>
			)}
		</group>
	)
}
