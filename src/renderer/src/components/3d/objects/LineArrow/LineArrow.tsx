import { Line, LineProps } from '@react-three/drei'
import { Vector3, Quaternion } from 'three'
import { BillboardAxis } from '../../utils'

interface ILineArrowCustomProps {
	position?: Vector3
	direction?: Vector3
	length?: number
	arrowSize?: number
	endBase?: boolean
}

type ILineArrowProps = ILineArrowCustomProps & Omit<LineProps, 'points'>

export const LineArrow = ({
	position = new Vector3(0, 0, 0),
	direction = new Vector3(1, 1, 1),
	length = 1,
	arrowSize = 0.25,
	endBase = true,
	...props
}: ILineArrowProps): React.JSX.Element => {
	// Normalize direction
	const dir = direction.clone().normalize()

	// Create quaternion that rotates X to "direction"
	const quat = new Quaternion()
	quat.setFromUnitVectors(new Vector3(1, 0, 0), dir)

	const linePoints = [
		[0, 0, 0],
		[length, 0, 0],
		[length - arrowSize, arrowSize * 0.4, 0],
		[length, 0, 0],
		[length - arrowSize, -arrowSize * 0.4, 0]
	]

	const arrowPosition = position.clone().sub(direction.clone().normalize().multiplyScalar(length))

	return (
		<>
			<BillboardAxis axis={direction} position={position}>
				<Line
					points={linePoints.flat()}
					position={endBase ? arrowPosition.toArray() : [0, 0, 0]}
					lineWidth={2}
					color={'red'}
					quaternion={quat}
					{...props}
				/>
			</BillboardAxis>
		</>
	)
}
