/**
 * Distributed Load in bars with local system
 */
import { Billboard, Line, Text } from '@react-three/drei'
import { forcesType } from '@renderer/types/Structure'
import React, { useMemo } from 'react'
import { Arrow } from '../../../Arrow'
import { CurvedArrow } from '../../../CurvedArrow'
import { Moment } from '../PointLoad/Moment'
import * as THREE from 'three'
import * as space2D from '@renderer/utils/functions/space2D'
import { linSpace } from '@renderer/utils/functions/others'
import * as matrix from '@renderer/utils/functions/matrix'

interface ILoadGlobalSystemProps {
	name: string
	forceDirection: forcesType
	loads: [number, number]
	xPositions: [number, number]
	barPoints: [THREE.Vector3, THREE.Vector3]

	height: number

	positiveArrowColor: string
	negativeArrowColor: string
	textColor: string
}

export const LoadGlobalSystem = ({
	name,
	forceDirection,
	loads,
	xPositions,
	height,
	positiveArrowColor,
	negativeArrowColor,
	textColor,
	barPoints
}: ILoadGlobalSystemProps): React.JSX.Element => {
	const rotationMatrix = useMemo(() => {
		const x1 = barPoints[1].x
		const y1 = barPoints[1].y
		const z1 = barPoints[1].z

		let dx = barPoints[1].x - barPoints[0].x
		let dy = barPoints[1].y - barPoints[0].y
		let dz = barPoints[1].z - barPoints[0].z

		const length = Math.sqrt(dx * dx + dy * dy + dz * dz)

		const rot_aux: [[number, number, number], [number, number, number], [number, number, number]] =
			[
				[0, 0, 0],
				[0, 0, 0],
				[0, 0, 0]
			] // Matriz auxiliar para cálculo da rotação
		rot_aux[0][0] = dx / length
		rot_aux[0][1] = dy / length
		rot_aux[0][2] = dz / length

		let aux: [number, number, number] = [0, 0, 0]
		if (dx !== 0 || dy !== 0) {
			// If not vertical
			aux = [x1, y1, z1 + 1]
		} else {
			if (dz > 0) {
				aux = [x1 - 1, y1, z1]
			} else {
				aux = [x1 + 1, y1, z1]
			}
		}

		dx = aux[0] - x1
		dy = aux[1] - y1
		dz = aux[2] - z1
		let c = Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2)

		const alpha = dx / c
		const beta = dy / c
		const gamma = dz / c

		dx = rot_aux[0][1] * gamma - rot_aux[0][2] * beta
		dy = rot_aux[0][2] * alpha - rot_aux[0][0] * gamma
		dz = rot_aux[0][0] * beta - rot_aux[0][1] * alpha
		c = Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2)

		rot_aux[2][0] = dx / c
		rot_aux[2][1] = dy / c
		rot_aux[2][2] = dz / c

		rot_aux[1][0] = rot_aux[0][2] * rot_aux[2][1] - rot_aux[0][1] * rot_aux[2][2]
		rot_aux[1][1] = rot_aux[0][0] * rot_aux[2][2] - rot_aux[0][2] * rot_aux[2][0]
		rot_aux[1][2] = rot_aux[0][1] * rot_aux[2][0] - rot_aux[0][0] * rot_aux[2][1]

		return rot_aux
	}, [barPoints])

	const globalXPositions = [
		matrix.multiply(rotationMatrix, [[xPositions[0]], [0], [0]])[0][0],
		matrix.multiply(rotationMatrix, [[xPositions[1]], [0], [0]])[0][0]
	]
	const globalYPositions = [
		matrix.multiply(rotationMatrix, [[0], [xPositions[0]], [0]])[0][0],
		matrix.multiply(rotationMatrix, [[0], [xPositions[1]], [0]])[0][0]
	]
	const globalZPositions = [
		matrix.multiply(rotationMatrix, [[0], [0], [xPositions[0]]])[0][0],
		matrix.multiply(rotationMatrix, [[0], [0], [xPositions[1]]])[0][0]
	]
	const globalPositions =
		barPoints[0].x === barPoints[1].x
			? barPoints[0].y === barPoints[1].y
				? globalZPositions
				: globalYPositions
			: globalXPositions

	let numberOfArrows = Math.ceil(Math.abs(xPositions[1] - xPositions[0]) / 0.3)
	numberOfArrows =
		forceDirection === 'Mx' || forceDirection === 'My' || forceDirection === 'Mz'
			? Math.ceil(numberOfArrows / 2)
			: numberOfArrows
	numberOfArrows = numberOfArrows % 2 === 0 ? numberOfArrows - 1 : numberOfArrows
	numberOfArrows = Math.max(numberOfArrows, 3)
	const scaleToHeight = height / Math.max(Math.abs(loads[0]), Math.abs(loads[1]))
	const xPositionsOfArrows = linSpace(globalPositions[0], globalPositions[1], numberOfArrows)
	const y = [loads[0] * scaleToHeight, loads[1] * scaleToHeight]
	const x = globalPositions
	const linearFunctionLoad = space2D.createLinearFunction([x[0], y[0]], [x[1], y[1]])
	const linearFunctionBarXY =
		barPoints[0].x === barPoints[1].x
			? barPoints[0].y === barPoints[1].y
				? space2D.createLinearFunction(
						[barPoints[0].z, barPoints[0].x],
						[barPoints[1].z, barPoints[1].x]
					)
				: space2D.createLinearFunction(
						[barPoints[0].y, barPoints[0].x],
						[barPoints[1].y, barPoints[1].x]
					)
			: space2D.createLinearFunction(
					[barPoints[0].x, barPoints[0].y],
					[barPoints[1].x, barPoints[1].y]
				)
	const parametersLinearBarXY =
		barPoints[0].x === barPoints[1].x
			? barPoints[0].y === barPoints[1].y
				? space2D.parametersOfLinearFunction(
						[barPoints[0].z, barPoints[0].x],
						[barPoints[1].z, barPoints[1].x]
					)
				: space2D.parametersOfLinearFunction(
						[barPoints[0].y, barPoints[0].x],
						[barPoints[1].y, barPoints[1].x]
					)
			: space2D.parametersOfLinearFunction(
					[barPoints[0].x, barPoints[0].y],
					[barPoints[1].x, barPoints[1].y]
				)
	const linearFunctionBarXZ =
		barPoints[0].x === barPoints[1].x
			? barPoints[0].y === barPoints[1].y
				? space2D.createLinearFunction(
						[barPoints[0].z, barPoints[0].y],
						[barPoints[1].z, barPoints[1].y]
					)
				: space2D.createLinearFunction(
						[barPoints[0].y, barPoints[0].z],
						[barPoints[1].y, barPoints[1].z]
					)
			: space2D.createLinearFunction(
					[barPoints[0].x, barPoints[0].z],
					[barPoints[1].x, barPoints[1].z]
				)
	const parametersLinearBarXZ =
		barPoints[0].x === barPoints[1].x
			? barPoints[0].y === barPoints[1].y
				? space2D.parametersOfLinearFunction(
						[barPoints[0].z, barPoints[0].y],
						[barPoints[1].z, barPoints[1].y]
					)
				: space2D.parametersOfLinearFunction(
						[barPoints[0].y, barPoints[0].z],
						[barPoints[1].y, barPoints[1].z]
					)
			: space2D.parametersOfLinearFunction(
					[barPoints[0].x, barPoints[0].z],
					[barPoints[1].x, barPoints[1].z]
				)

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
	if (loads[0] <= 0 && loads[1] <= 0) {
		if (forceDirection === 'Fy') {
			lines = (
				<Line
					worldUnits
					points={[
						x[0],
						y[0] - linearFunctionBarXY(x[0]) + parametersLinearBarXY.b,
						-linearFunctionBarXZ(x[0]) + parametersLinearBarXZ.b,
						x[1],
						y[1] - linearFunctionBarXY(x[1]) + parametersLinearBarXY.b,
						-linearFunctionBarXZ(x[1]) + parametersLinearBarXZ.b
					]}
					lineWidth={0.02}
					color={negativeArrowColor}
				/>
			)
		} else if (forceDirection === 'Fz') {
			lines = (
				<Line
					worldUnits
					points={[
						x[0],
						y[0] - (linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b),
						linearFunctionBarXY(x[0]) - parametersLinearBarXY.b,
						x[1],
						y[1] - linearFunctionBarXZ(x[1]) + parametersLinearBarXZ.b,
						linearFunctionBarXY(x[1]) - parametersLinearBarXY.b
					]}
					lineWidth={0.02}
					color={negativeArrowColor}
				/>
			)
		}
	} else if (loads[0] >= 0 && loads[1] >= 0) {
		if (forceDirection === 'Fy') {
			lines = (
				<Line
					worldUnits
					points={[
						x[0],
						y[0] - linearFunctionBarXY(x[0]) + parametersLinearBarXY.b,
						-linearFunctionBarXZ(x[0]) + parametersLinearBarXZ.b,
						x[1],
						y[1] - linearFunctionBarXY(x[1]) + parametersLinearBarXY.b,
						-linearFunctionBarXZ(x[1]) + parametersLinearBarXZ.b
					]}
					lineWidth={0.02}
					color={positiveArrowColor}
				/>
			)
		} else if (forceDirection === 'Fz') {
			lines = (
				<Line
					worldUnits
					points={[
						x[0],
						y[0] - (linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b),
						linearFunctionBarXY(x[0]) - parametersLinearBarXY.b,
						x[1],
						y[1] - linearFunctionBarXZ(x[1]) + parametersLinearBarXZ.b,
						linearFunctionBarXY(x[1]) - parametersLinearBarXY.b
					]}
					lineWidth={0.02}
					color={positiveArrowColor}
				/>
			)
		}
	} else {
		const root = space2D.rootLinear([x[0], y[0]], [x[1], y[1]])
		if (forceDirection === 'Fy') {
			lines = (
				<>
					<Line
						worldUnits
						points={[
							x[0],
							y[0] - linearFunctionBarXY(x[0]) + parametersLinearBarXY.b,
							-linearFunctionBarXZ(x[0]) + parametersLinearBarXZ.b,
							root,
							-linearFunctionBarXY(root) + parametersLinearBarXY.b,
							-linearFunctionBarXZ(root) + parametersLinearBarXZ.b
						]}
						lineWidth={0.02}
						color={loads[0] < 0 ? negativeArrowColor : positiveArrowColor}
					/>
					<Line
						worldUnits
						points={[
							root,
							-linearFunctionBarXY(root) + parametersLinearBarXY.b,
							-linearFunctionBarXZ(root) + parametersLinearBarXZ.b,
							x[1],
							y[1] - linearFunctionBarXY(x[1]) + parametersLinearBarXY.b,
							-linearFunctionBarXZ(x[1]) + parametersLinearBarXZ.b
						]}
						lineWidth={0.02}
						color={loads[1] < 0 ? negativeArrowColor : positiveArrowColor}
					/>
				</>
			)
		} else if (forceDirection === 'Fz') {
			lines = (
				<>
					<Line
						worldUnits
						points={[
							x[0],
							y[0] - (linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b),
							linearFunctionBarXY(x[0]) - parametersLinearBarXY.b,
							root,
							-linearFunctionBarXZ(root) + parametersLinearBarXZ.b,
							linearFunctionBarXY(root) - parametersLinearBarXY.b
						]}
						lineWidth={0.02}
						color={loads[0] < 0 ? negativeArrowColor : positiveArrowColor}
					/>
					<Line
						worldUnits
						points={[
							root,
							-linearFunctionBarXZ(root) + parametersLinearBarXZ.b,
							linearFunctionBarXY(root) - parametersLinearBarXY.b,
							x[1],
							y[1] - linearFunctionBarXZ(x[1]) + parametersLinearBarXZ.b,
							linearFunctionBarXY(x[1]) - parametersLinearBarXY.b
						]}
						lineWidth={0.02}
						color={loads[1] < 0 ? negativeArrowColor : positiveArrowColor}
					/>
				</>
			)
		}
	}

	return (
		<>
			{/* Forces ///////////////////////////////////////////////////////////////////////////////*/}
			{forceDirection === 'Fy' && (
				<group
					rotation={rotation}
					position={barPoints[0]}
					rotation-y={
						barPoints[0].x === barPoints[1].x || barPoints[0].y === barPoints[1].y
							? (Math.PI / 2) * (barPoints[0].y === barPoints[1].y ? -1 : 1)
							: 0
					}
				>
					<group rotation-x={Math.PI}>
						{lines}

						{xPositionsOfArrows.map((xPos) => {
							const yPos = linearFunctionLoad(xPos)
							if (Math.abs(yPos) < 0.1) return null
							return (
								<Arrow
									key={`${name}-${forceDirection}-${xPos}`}
									direction={yPos < 0 ? 'y' : '-y'}
									position={[
										xPos,
										yPos - linearFunctionBarXY(xPos) + parametersLinearBarXY.b,
										-linearFunctionBarXZ(xPos) + parametersLinearBarXZ.b
									]}
									length={Math.abs(yPos)}
									scale={0.3}
									color={yPos < 0 ? negativeArrowColor : positiveArrowColor}
								/>
							)
						})}
					</group>
					<Billboard
						position={[
							x[0],
							-y[0] + linearFunctionBarXY(x[0]) - parametersLinearBarXY.b,
							linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b
						]}
					>
						<Text renderOrder={10} anchorX={'left'} font='/fonts/Inter-Regular.woff' fontSize={0.1}>
							{loads[0]}
							<meshBasicMaterial color={textColor} depthTest={false} />
						</Text>
					</Billboard>
					<Billboard
						position={[
							x[1],
							-y[1] + linearFunctionBarXY(x[1]) - parametersLinearBarXY.b,
							linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b
						]}
					>
						<Text renderOrder={10} anchorX={'left'} font='/fonts/Inter-Regular.woff' fontSize={0.1}>
							{loads[1]}
							<meshBasicMaterial color={textColor} depthTest={false} />
						</Text>
					</Billboard>
				</group>
			)}
			{forceDirection === 'Fz' && (
				<group
					rotation={rotation}
					position={barPoints[0]}
					rotation-y={barPoints[0].x === barPoints[1].x ? Math.PI / 2 : 0}
				>
					<group rotation-x={Math.PI}>
						{lines}

						{xPositionsOfArrows.map((xPos) => {
							const yPos = linearFunctionLoad(xPos)
							if (Math.abs(yPos) < 0.1) return null
							return (
								<Arrow
									key={`${name}-${forceDirection}-${xPos}`}
									direction={yPos < 0 ? 'y' : '-y'}
									position={[
										xPos,
										yPos - linearFunctionBarXZ(xPos) + parametersLinearBarXZ.b,
										linearFunctionBarXY(xPos) - parametersLinearBarXY.b
									]}
									length={Math.abs(yPos)}
									scale={0.3}
									color={yPos < 0 ? negativeArrowColor : positiveArrowColor}
								/>
							)
						})}
					</group>
					<Billboard
						position={[
							x[0],
							-y[0] + linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b,
							-linearFunctionBarXY(x[0]) + parametersLinearBarXY.b
						]}
					>
						<Text renderOrder={10} anchorX={'left'} font='/fonts/Inter-Regular.woff' fontSize={0.1}>
							{loads[0]}
							<meshBasicMaterial color={textColor} depthTest={false} />
						</Text>
					</Billboard>
					<Billboard
						position={[
							x[1],
							-y[1] + linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b,
							-linearFunctionBarXY(x[1]) + parametersLinearBarXY.b
						]}
					>
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
						const yPos = linearFunctionLoad(xPos)
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
						const yPos = linearFunctionLoad(xPos)
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
