/**
 * Distributed Load in bars with local system
 */
import { Billboard, Line, Text } from '@react-three/drei'
import { forcesType } from '@renderer/types/Structure'
import * as space2D from '@renderer/utils/functions/space2D'
import React from 'react'
import { Arrow } from '../../../Arrow'
import { CurvedArrow } from '../../../CurvedArrow'
import { Moment } from '../PointLoad/Moment'
import { linSpace } from '@renderer/utils/functions/others'

interface ILoadLocalSystemProps {
	name: string
	forceDirection?: forcesType
	loads: [number, number]
	xPositions: [number, number]

	height: number

	positiveArrowColor: string
	negativeArrowColor: string
	textColor: string
}

export const LoadLocalSystem = ({
	name,
	forceDirection,
	loads,
	xPositions,
	height,
	positiveArrowColor,
	negativeArrowColor,
	textColor
}: ILoadLocalSystemProps): React.JSX.Element => {
	let numberOfArrows = Math.ceil((xPositions[1] - xPositions[0]) / 0.3)
	numberOfArrows =
		forceDirection === 'Mx' || forceDirection === 'My' || forceDirection === 'Mz'
			? Math.ceil(numberOfArrows / 2)
			: numberOfArrows
	numberOfArrows = numberOfArrows % 2 === 0 ? numberOfArrows - 1 : numberOfArrows
	numberOfArrows = Math.max(numberOfArrows, 3)
	const scaleToHeight = height / Math.max(Math.abs(loads[0]), Math.abs(loads[1]))
	const xPositionsOfArrows = linSpace(xPositions[0], xPositions[1], numberOfArrows)
	const y = [loads[0] * scaleToHeight, loads[1] * scaleToHeight]
	const x = xPositions
	const linearFunction = space2D.createLinearFunction([x[0], y[0]], [x[1], y[1]])

	// Rotation for adjust the load to the bar direction
	const rotation: [number, number, number] = [0, 0, 0]
	switch (forceDirection) {
		case 'Fy':
			break
		case 'Fz':
			rotation[0] = Math.PI / 2
			break
	}

	// Create the line of the distributed load in Fy or Fz direction
	let lines: React.JSX.Element = <></>
	if (loads[0] <= 0 && loads[1] <= 0 && forceDirection !== 'Fx') {
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
		const root = space2D.rootLinear([x[0], y[0]], [x[1], y[1]])
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
		<>
			{/* Forces ///////////////////////////////////////////////////////////////////////////////*/}
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
			{/* Moments //////////////////////////////////////////////////////////////////////////////*/}
			{(forceDirection === 'Mx' || forceDirection === 'My' || forceDirection === 'Mz') && (
				<>
					{xPositionsOfArrows.map((xPos) => {
						const yPos = linearFunction(xPos)
						if (loads[0] !== 0 && loads[1] !== 0 && Math.abs(yPos) < 0.00001)
							if (Math.abs(loads[0]) === Math.abs(loads[1]))
								return (
									<group key={`${name}-${xPos}-${forceDirection}`}>
										<CurvedArrow
											direction={
												loads[0] < 0
													? forceDirection === 'Mx'
														? '-x'
														: forceDirection === 'My'
															? '-y'
															: '-z'
													: forceDirection === 'Mx'
														? 'x'
														: forceDirection === 'My'
															? 'y'
															: 'z'
											}
											position={[xPos - 0.01, 0, 0]}
											radius={(Math.abs(yPos) + 0.1) * 0.5}
											scale={0.2 * 0.5}
											color={loads[0] < 0 ? negativeArrowColor : positiveArrowColor}
										/>
										<CurvedArrow
											direction={
												loads[0] < 0
													? forceDirection === 'Mx'
														? 'x'
														: forceDirection === 'My'
															? 'y'
															: 'z'
													: forceDirection === 'Mx'
														? '-x'
														: forceDirection === 'My'
															? '-y'
															: '-z'
											}
											position={[xPos + 0.01, 0, 0]}
											radius={(Math.abs(yPos) + 0.1) * 0.5}
											scale={0.2 * 0.5}
											color={loads[0] < 0 ? positiveArrowColor : negativeArrowColor}
										/>
									</group>
								)
							else return null

						let direction: 'x' | '-x' | 'y' | '-y' | 'z' | '-z' =
							yPos < 0
								? forceDirection === 'Mx'
									? '-x'
									: forceDirection === 'My'
										? '-y'
										: '-z'
								: forceDirection === 'Mx'
									? 'x'
									: forceDirection === 'My'
										? 'y'
										: 'z'
						if (yPos === 0)
							if (Math.abs(loads[0]) >= Math.abs(loads[1]))
								direction =
									loads[0] < 0
										? forceDirection === 'Mx'
											? '-x'
											: forceDirection === 'My'
												? '-y'
												: '-z'
										: forceDirection === 'Mx'
											? 'x'
											: forceDirection === 'My'
												? 'y'
												: 'z'
							else
								direction =
									loads[0] < 0
										? forceDirection === 'Mx'
											? '-x'
											: forceDirection === 'My'
												? '-y'
												: '-z'
										: forceDirection === 'Mx'
											? 'x'
											: forceDirection === 'My'
												? 'y'
												: 'z'
						return (
							<group key={`${name}-${forceDirection}-${xPos}`} position={[xPos, 0, 0]}>
								<Moment
									direction={direction}
									value={xPositionsOfArrows[0] === xPos ? loads[0] : loads[1]}
									scale={(Math.abs(yPos) + 0.1) * 0.3}
									radius={(Math.abs(yPos) + 0.1) * 0.3}
									arrowColor={yPos < 0 ? negativeArrowColor : positiveArrowColor}
									textColor={textColor}
									label={
										xPositionsOfArrows[0] === xPos ||
										xPositionsOfArrows[xPositionsOfArrows.length - 1] === xPos
									}
								/>
							</group>
						)
					})}
				</>
			)}
		</>
	)
}
