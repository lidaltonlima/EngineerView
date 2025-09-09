/**
 * Distributed Load in bars
 */
import { Billboard, Line, Text } from '@react-three/drei'
import { linSpace } from '@renderer/utils/functions'
import { createLinearFunction, rootLinear } from '@renderer/utils/functions/space2d'
import { forcesType } from '@renderer/types/Structure'
import React from 'react'
import { Arrow } from '../../../Arrow'

interface IDistributedLoad1DCustomProps {
	name: string
	forceDirection?: forcesType
	loads: [number, number]
	xPositions: [number, number]

	height?: number

	positiveArrowColor?: string
	negativeArrowColor?: string
	textColor?: string
}

type IDistributedLoad1DProps = IDistributedLoad1DCustomProps & React.JSX.IntrinsicElements['group']

export const DistributedLoad1D = ({
	name,
	forceDirection = 'Fx',
	loads,
	xPositions,
	height = 1,
	positiveArrowColor = 'white',
	negativeArrowColor = 'magenta',
	textColor = 'white',
	...props
}: IDistributedLoad1DProps): React.JSX.Element => {
	let numberOfArrows = Math.max(Math.ceil((xPositions[1] - xPositions[0]) / 0.3), 3)
	numberOfArrows = numberOfArrows % 2 === 0 ? numberOfArrows - 1 : numberOfArrows
	const scaleToHeight = height / Math.max(Math.abs(loads[0]), Math.abs(loads[1]))
	const xPositionsOfArrows = linSpace(xPositions[0], xPositions[1], numberOfArrows)
	const y = [loads[0] * scaleToHeight, loads[1] * scaleToHeight]
	const x = xPositions
	const linearFunction = createLinearFunction([x[0], y[0]], [x[1], y[1]])

	// Rotation for adjust the load to the bar direction
	const rotation: [number, number, number] = [0, 0, 0]
	switch (forceDirection) {
		case 'Fy':
			break
		case 'Fz':
			rotation[0] = Math.PI / 2
			break
	}

	let lines: React.JSX.Element = <></>
	if (loads[0] <= 0 && loads[1] <= 0) {
		lines = (
			<Line
				worldUnits
				points={[x[0], y[0], 0, x[1], y[1], 0]}
				lineWidth={0.02}
				color={negativeArrowColor}
			/>
		)
	} else if (loads[0] >= 0 && loads[1] >= 0) {
		lines = (
			<Line
				worldUnits
				points={[x[0], y[0], 0, x[1], y[1], 0]}
				lineWidth={0.02}
				color={positiveArrowColor}
			/>
		)
	} else {
		const root = rootLinear([x[0], y[0]], [x[1], y[1]])
		lines = (
			<>
				<Line
					worldUnits
					points={[x[0], y[0], 0, root, 0, 0]}
					lineWidth={0.02}
					color={loads[0] < 0 ? negativeArrowColor : positiveArrowColor}
				/>
				<Line
					worldUnits
					points={[root, 0, 0, x[1], y[1], 0]}
					lineWidth={0.02}
					color={loads[1] < 0 ? negativeArrowColor : positiveArrowColor}
				/>
			</>
		)
	}

	return (
		<group {...props}>
			{(forceDirection === 'Fy' || forceDirection === 'Fz') && (
				<group rotation={rotation}>
					<group rotation-x={Math.PI}>
						{lines}

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
									color={yPos < 0 ? negativeArrowColor : positiveArrowColor}
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
											direction={loads[0] < 0 ? '-x' : 'x'}
											position={[xPos - 0.01 - (loads[0] < 0 ? 0.05 : 0), 0, 0]}
											length={0}
											scale={0.2 * 0.5}
											color={loads[0] < 0 ? negativeArrowColor : positiveArrowColor}
											notLine
										/>
										<Arrow
											direction={loads[0] < 0 ? 'x' : '-x'}
											position={[xPos + 0.01 + (loads[0] < 0 ? 0.05 : 0), 0, 0]}
											length={0}
											scale={0.2 * 0.5}
											color={loads[0] < 0 ? positiveArrowColor : negativeArrowColor}
											notLine
											endBase
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
								color={yPos < 0 ? negativeArrowColor : positiveArrowColor}
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
