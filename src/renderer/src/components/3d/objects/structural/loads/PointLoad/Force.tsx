import { Vector3 } from 'three'
import { Arrow } from '../../../Arrow'
import { BillboardTextAxis } from '@renderer/components/3d/utils'

interface IForceCustomProps {
	forceDirection: 'x' | 'y' | 'z' | '-x' | '-y' | '-z'
	value: number
	arrowColor?: string
	textColor?: string
	label?: boolean
}

type IForceProps = IForceCustomProps & React.JSX.IntrinsicElements['group']

export const Force = ({
	forceDirection,
	value,
	arrowColor = 'white',
	textColor = 'white',
	label = false,
	...groupProps
}: IForceProps): React.JSX.Element => {
	const billboardPosition = new Vector3()
	let anchorXLabel: 'right' | 'left' = 'left'
	const labelDirection = new Vector3(0, 0, 0)
	const offsetLabel = 0.2
	switch (forceDirection) {
		case 'x':
			labelDirection.set(1, 0, 0)
			anchorXLabel = 'right'
			billboardPosition.set(-offsetLabel, 0, 0)
			break
		case 'y':
			labelDirection.set(0, 1, 0)
			anchorXLabel = 'right'
			billboardPosition.set(0, -offsetLabel, 0)
			break
		case 'z':
			labelDirection.set(0, 0, 1)
			anchorXLabel = 'right'
			billboardPosition.set(0, 0, -offsetLabel)
			break
		case '-x':
			labelDirection.set(1, 0, 0)
			billboardPosition.set(offsetLabel, 0, 0)
			break
		case '-y':
			labelDirection.set(0, 1, 0)
			billboardPosition.set(0, offsetLabel, 0)
			break
		case '-z':
			labelDirection.set(0, 0, 1)
			billboardPosition.set(0, 0, offsetLabel)
	}

	return (
		<group {...groupProps}>
			<Arrow
				renderOrder={9}
				endBase
				color={arrowColor}
				direction={forceDirection}
				scale={0.4}
				length={0.35}
			/>
			{label && (
				// <Billboard position={billboardPosition}>
				// 	<Text
				// 		rotation-z={labelRotation}
				// 		renderOrder={10}
				// 		anchorX={anchorXLabel}
				// 		font='/fonts/Inter-Regular.woff'
				// 		fontSize={0.1}
				// 	>
				// 		{value.toString()}
				// 		<meshBasicMaterial color={textColor} depthTest={false} />
				// 	</Text>
				// </Billboard>
				<BillboardTextAxis
					axis={labelDirection}
					position={billboardPosition}
					anchorX={anchorXLabel}
					font='/fonts/Inter-Regular.woff'
					fontSize={0.1}
					color={textColor}
				>
					{value.toString()}
				</BillboardTextAxis>
			)}
		</group>
	)
}
