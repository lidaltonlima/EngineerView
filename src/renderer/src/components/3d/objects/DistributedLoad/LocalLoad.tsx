import { Billboard, Line, Text } from '@react-three/drei'
import { createLineFunction } from '../../utils/functions/space2d'
import { linSpace } from '../../utils/functions'
import { Arrow } from '../Arrow'

interface ILinearLoadCustomProps {
	name?: string
	direction?: 'x' | 'y' | 'z'
	loads?: [number, number]
	xPositions?: [number, number]

	height?: number
	numberOfArrows?: number

	arrowColor?: string
	textColor?: string
}

type ILinearLoadProps = ILinearLoadCustomProps & React.JSX.IntrinsicElements['group']

export const LinearLoad = ({
	name = 'FP1',
	direction = 'z',
	loads = [-3, 1],
	xPositions = [0.5, 1.5],
	height = 1,
	numberOfArrows = 5,
	arrowColor = 'white',
	textColor = 'white',
	...props
}: ILinearLoadProps): React.JSX.Element => {
	const scaleToHeight = height / Math.max(Math.abs(loads[0]), Math.abs(loads[1]))
	const xPositionsOfArrows = linSpace(xPositions[0], xPositions[1], numberOfArrows)
	const y = [loads[0] * scaleToHeight, loads[1] * scaleToHeight]
	const x = xPositions
	const linearFunction = createLineFunction([x[0], y[0]], [x[1], y[1]])

	const rotation: [number, number, number] = [0, 0, 0]
	switch (direction) {
		case 'x':
			rotation[0] = Math.PI
			rotation[2] = -Math.PI / 2
			break
		case 'y':
			break
		case 'z':
			rotation[0] = Math.PI / 2
			break
	}

	return (
		<group {...props}>
			<group rotation={rotation}>
				<group rotation-x={Math.PI}>
					<Line
						worldUnits
						points={[x[0], y[0], 0, x[1], y[1], 0]}
						lineWidth={0.02}
						color={arrowColor}
					/>
					{xPositionsOfArrows.map((xPos) => {
						const yPos = linearFunction(xPos)
						if (Math.abs(yPos) < 0.1) return null
						return (
							<Arrow
								key={`${name}-arrow-${xPos}`}
								direction={yPos < 0 ? 'y' : '-y'}
								position={[xPos, yPos, 0]}
								length={Math.abs(yPos)}
								scale={0.3}
								color={arrowColor}
							/>
						)
					})}
				</group>
				<Billboard position={[x[0], -y[0], 0]}>
					<Text renderOrder={10} anchorX={'left'} font='/fonts/Inter-Regular.woff' fontSize={0.1}>
						{loads[0]}
						<meshBasicMaterial color={textColor} depthTest={false} />
					</Text>
				</Billboard>
				<Billboard position={[x[1], -y[1], 0]}>
					<Text renderOrder={10} anchorX={'left'} font='/fonts/Inter-Regular.woff' fontSize={0.1}>
						{loads[1]}
						<meshBasicMaterial color={textColor} depthTest={false} />
					</Text>
				</Billboard>
			</group>
		</group>
	)
}
