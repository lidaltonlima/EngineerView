import { Line, LineProps } from '@react-three/drei'
import { linSpace } from '../../functions'

interface IArcCustomProps {
	radius?: number
	angle?: number
	lineProps?: Omit<LineProps, 'points'>
}

type IArcProps = IArcCustomProps & React.JSX.IntrinsicElements['group']

export const Arc = ({
	radius = 1,
	angle = Math.PI * 2,
	lineProps,
	...props
}: IArcProps): React.JSX.Element => {
	const anglesToLinePoints = linSpace(0, angle, 64)
	const linePoints = anglesToLinePoints.map((value) => [
		radius * Math.cos(value),
		radius * Math.sin(value),
		0
	])

	return (
		<group {...props}>
			<Line points={linePoints.flat()} {...lineProps} />
		</group>
	)
}
