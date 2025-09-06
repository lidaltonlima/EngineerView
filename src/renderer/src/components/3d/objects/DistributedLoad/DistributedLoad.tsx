import { Billboard, Line, Text } from '@react-three/drei'
import { createLineFunction } from '../../utils/functions/space2d'
import { linSpace } from '../../utils/functions'
import { Arrow } from '../Arrow'
import { forcesType } from '@renderer/types/Structure'

interface ILinearLoadCustomProps {
	name: string
	forceDirection?: forcesType
	loads: [number, number]
	xPositions: [number, number]

	height?: number

	arrowColor?: string
	textColor?: string
}

type ILinearLoadProps = ILinearLoadCustomProps & React.JSX.IntrinsicElements['group']

export const DistributedLoad = ({
	name,
	forceDirection = 'Fx',
	loads,
	xPositions,
	height = 1,
	arrowColor = 'white',
	textColor = 'white',
	...props
}: ILinearLoadProps): React.JSX.Element => {
	let numberOfArrows = Math.max(Math.ceil((xPositions[1] - xPositions[0]) / 0.3), 3)
	numberOfArrows = numberOfArrows % 2 === 0 ? numberOfArrows - 1 : numberOfArrows
	const scaleToHeight = height / Math.max(Math.abs(loads[0]), Math.abs(loads[1]))
	const xPositionsOfArrows = linSpace(xPositions[0], xPositions[1], numberOfArrows)
	const y = [loads[0] * scaleToHeight, loads[1] * scaleToHeight]
	const x = xPositions
	const linearFunction = createLineFunction([x[0], y[0]], [x[1], y[1]])

	const rotation: [number, number, number] = [0, 0, 0]
	switch (forceDirection) {
		case 'Fy':
			break
		case 'Fz':
			rotation[0] = Math.PI / 2
			break
	}

	return (
		<group {...props}>
			{(forceDirection === 'Fy' || forceDirection === 'Fz') && (
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
									key={`${name}-${forceDirection}-${xPos}`}
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
			)}
			{forceDirection === 'Fx' && (
				<>
					{xPositionsOfArrows.map((xPos) => {
						const yPos = linearFunction(xPos)
						if (loads[0] !== 0 && loads[1] !== 0 && Math.abs(yPos) < 0.00001)
							if (Math.abs(loads[0]) === Math.abs(loads[1]))
								return (
									<group key={`${name}-${xPos}-${forceDirection}`}>
										<Arrow
											direction={'x'}
											position={[xPos, 0, 0]}
											length={loads[0] < 0 ? 0.05 : -0.01}
											scale={0.2 * 0.5}
											color={arrowColor}
											notLine
										/>
										<Arrow
											direction={'-x'}
											position={[xPos, 0, 0]}
											length={loads[0] < 0 ? 0.05 : -0.01}
											scale={0.2 * 0.5}
											color={arrowColor}
											notLine
										/>
									</group>
								)
							else return null

						let direction: 'x' | '-x' = yPos < 0 ? '-x' : 'x'
						if (yPos === 0)
							if (Math.abs(loads[0]) >= Math.abs(loads[1])) direction = loads[0] < 0 ? '-x' : 'x'
							else direction = loads[1] < 0 ? '-x' : 'x'
						return (
							<Arrow
								key={`${name}-${forceDirection}-${xPos}`}
								direction={direction}
								position={[xPos, 0, 0]}
								length={0}
								scale={(Math.abs(yPos) + 0.2) * 0.5}
								color={arrowColor}
								notLine
								endBase
							/>
						)
					})}
					<Billboard position={[x[0], 0, 0]}>
						<Text renderOrder={10} anchorX={'left'} font='/fonts/Inter-Regular.woff' fontSize={0.1}>
							{loads[0]}
							<meshBasicMaterial color={textColor} depthTest={false} />
						</Text>
					</Billboard>
					<Billboard position={[x[1], 0, 0]}>
						<Text renderOrder={10} anchorX={'left'} font='/fonts/Inter-Regular.woff' fontSize={0.1}>
							{loads[1]}
							<meshBasicMaterial color={textColor} depthTest={false} />
						</Text>
					</Billboard>
				</>
			)}
		</group>
	)
}
