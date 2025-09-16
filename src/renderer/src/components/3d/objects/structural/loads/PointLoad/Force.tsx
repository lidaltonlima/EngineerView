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
	let labelDirection: 'x' | 'y' | 'z' = 'x'
	const offsetLabel = 0.2
	switch (forceDirection) {
		case 'x':
			labelDirection = 'x'
			anchorXLabel = 'right'
			billboardPosition.set(-offsetLabel, 0, 0)
			break
		case 'y':
			labelDirection = 'y'
			anchorXLabel = 'right'
			billboardPosition.set(0, -offsetLabel, 0)
			break
		case 'z':
			labelDirection = 'z'
			anchorXLabel = 'right'
			billboardPosition.set(0, 0, -offsetLabel)
			break
		case '-x':
			labelDirection = 'x'
			billboardPosition.set(offsetLabel, 0, 0)
			break
		case '-y':
			labelDirection = 'y'
			billboardPosition.set(0, offsetLabel, 0)
			break
		case '-z':
			labelDirection = 'z'
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
					anchorY='bottom'
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
