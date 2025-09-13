/**
 * Distributed Load in bars with local system
 */
import { forcesType } from '@renderer/types/Structure'
import React from 'react'
import * as THREE from 'three'
import * as space2D from '@renderer/utils/functions/space2D'
import { linSpace } from '@renderer/utils/functions/others'
import * as matrix from '@renderer/utils/functions/matrix'
import { Arrow } from '../../../Arrow'
import { Billboard, Line, Text } from '@react-three/drei'
import { createRotationMatrix } from '@renderer/utils/functions/matrix'

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
	const rotationMatrix = createRotationMatrix(barPoints)

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

	// Create the line of the distributed load in Fy or Fz direction
	let lines: React.JSX.Element = <></>
	if ((loads[0] >= 0 && loads[1] >= 0) || (loads[0] <= 0 && loads[1] <= 0)) {
		switch (forceDirection) {
			case 'Fx':
				if (barPoints[0].x === barPoints[1].x) {
					if (barPoints[0].y === barPoints[1].y) {
						lines = (
							<Line
								worldUnits
								points={[-y[0], 0, x[0], -y[1], 0, x[1]]}
								lineWidth={0.02}
								color={loads[0] >= 0 && loads[1] >= 0 ? positiveArrowColor : negativeArrowColor}
							/>
						)
					} else {
						lines = (
							<Line
								worldUnits
								points={[
									-y[0],
									x[0],
									linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b,
									-y[1],
									x[1],
									linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b
								]}
								lineWidth={0.02}
								color={loads[0] >= 0 && loads[1] >= 0 ? positiveArrowColor : negativeArrowColor}
							/>
						)
					}
				} else {
					if (!(barPoints[0].y === barPoints[1].y && barPoints[0].z === barPoints[1].z)) {
						lines = (
							<Line
								worldUnits
								points={[
									-y[0] + x[0],
									linearFunctionBarXY(x[0]) - parametersLinearBarXY.b,
									linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b,
									-y[1] + x[1],
									linearFunctionBarXY(x[1]) - parametersLinearBarXY.b,
									linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b
								]}
								lineWidth={0.02}
								color={loads[0] >= 0 && loads[1] >= 0 ? positiveArrowColor : negativeArrowColor}
							/>
						)
					}
				}
				break
			case 'Fy':
				if (barPoints[0].x === barPoints[1].x) {
					if (barPoints[0].y === barPoints[1].y) {
						lines = (
							<Line
								worldUnits
								points={[0, -y[0], x[0], 0, -y[1], x[1]]}
								lineWidth={0.02}
								color={loads[0] >= 0 && loads[1] >= 0 ? positiveArrowColor : negativeArrowColor}
							/>
						)
					} else {
						if (!(barPoints[0].z === barPoints[1].z)) {
							lines = (
								<Line
									worldUnits
									points={[
										0,
										x[0] - y[0],
										linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b,
										0,
										x[1] - y[1],
										linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b
									]}
									lineWidth={0.02}
									color={loads[0] >= 0 && loads[1] >= 0 ? positiveArrowColor : negativeArrowColor}
								/>
							)
						}
					}
				} else {
					lines = (
						<Line
							worldUnits
							points={[
								x[0],
								-y[0] + linearFunctionBarXY(x[0]) - parametersLinearBarXY.b,
								linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b,
								x[1],
								-y[1] + linearFunctionBarXY(x[1]) - parametersLinearBarXY.b,
								linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b
							]}
							lineWidth={0.02}
							color={loads[0] >= 0 && loads[1] >= 0 ? positiveArrowColor : negativeArrowColor}
						/>
					)
				}
				break
			case 'Fz':
				if (barPoints[0].x === barPoints[1].x) {
					if (!(barPoints[0].y === barPoints[1].y)) {
						lines = (
							<Line
								worldUnits
								points={[
									0,
									x[0],
									-y[0] + linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b,
									0,
									x[1],
									-y[1] + linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b
								]}
								lineWidth={0.02}
								color={loads[0] >= 0 && loads[1] >= 0 ? positiveArrowColor : negativeArrowColor}
							/>
						)
					}
				} else {
					lines = (
						<Line
							worldUnits
							points={[
								x[0],
								linearFunctionBarXY(x[0]) - parametersLinearBarXY.b,
								-y[0] + linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b,
								x[1],
								linearFunctionBarXY(x[1]) - parametersLinearBarXY.b,
								-y[1] + linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b
							]}
							lineWidth={0.02}
							color={loads[0] >= 0 && loads[1] >= 0 ? positiveArrowColor : negativeArrowColor}
						/>
					)
				}
				break
		}
	} else {
		const root = space2D.rootLinear([x[0], y[0]], [x[1], y[1]])
		switch (forceDirection) {
			case 'Fx':
				if (barPoints[0].x === barPoints[1].x) {
					if (barPoints[0].y === barPoints[1].y) {
						lines = (
							<>
								<Line
									worldUnits
									points={[-y[0], 0, x[0], 0, 0, root]}
									lineWidth={0.02}
									color={loads[0] < 0 ? negativeArrowColor : positiveArrowColor}
								/>
								<Line
									worldUnits
									points={[0, 0, root, -y[1], 0, x[1]]}
									lineWidth={0.02}
									color={loads[1] < 0 ? negativeArrowColor : positiveArrowColor}
								/>
							</>
						)
					} else {
						lines = (
							<>
								<Line
									worldUnits
									points={[
										-y[0],
										x[0],
										linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b,
										0,
										root,
										linearFunctionBarXZ(root) - parametersLinearBarXZ.b
									]}
									lineWidth={0.02}
									color={loads[0] < 0 ? negativeArrowColor : positiveArrowColor}
								/>
								<Line
									worldUnits
									points={[
										0,
										root,
										linearFunctionBarXZ(root) - parametersLinearBarXZ.b,
										-y[1],
										x[1],
										linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b
									]}
									lineWidth={0.02}
									color={loads[1] < 0 ? negativeArrowColor : positiveArrowColor}
								/>
							</>
						)
					}
				} else {
					if (!(barPoints[0].y === barPoints[1].y && barPoints[0].z === barPoints[1].z)) {
						lines = (
							<>
								<Line
									worldUnits
									points={[
										-y[0] + x[0],
										linearFunctionBarXY(x[0]) - parametersLinearBarXY.b,
										linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b,
										root,
										linearFunctionBarXY(root) - parametersLinearBarXY.b,
										linearFunctionBarXZ(root) - parametersLinearBarXZ.b
									]}
									lineWidth={0.02}
									color={loads[0] < 0 ? negativeArrowColor : positiveArrowColor}
								/>
								<Line
									worldUnits
									points={[
										root,
										linearFunctionBarXY(root) - parametersLinearBarXY.b,
										linearFunctionBarXZ(root) - parametersLinearBarXZ.b,
										-y[1] + x[1],
										linearFunctionBarXY(x[1]) - parametersLinearBarXY.b,
										linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b
									]}
									lineWidth={0.02}
									color={loads[1] < 0 ? negativeArrowColor : positiveArrowColor}
								/>
							</>
						)
					}
				}
				break
			case 'Fy':
				if (barPoints[0].x === barPoints[1].x) {
					if (barPoints[0].y === barPoints[1].y) {
						lines = (
							<>
								<Line
									worldUnits
									points={[0, -y[0], x[0], 0, 0, root]}
									lineWidth={0.02}
									color={loads[0] < 0 ? negativeArrowColor : positiveArrowColor}
								/>
								<Line
									worldUnits
									points={[0, 0, root, 0, -y[1], x[1]]}
									lineWidth={0.02}
									color={loads[1] < 0 ? negativeArrowColor : positiveArrowColor}
								/>
							</>
						)
					} else {
						if (!(barPoints[0].z === barPoints[1].z)) {
							lines = (
								<>
									<Line
										worldUnits
										points={[
											0,
											x[0] - linearFunctionLoad(x[0]),
											linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b,
											0,
											root,
											linearFunctionBarXZ(root) - parametersLinearBarXZ.b
										]}
										lineWidth={0.02}
										color={loads[0] < 0 ? negativeArrowColor : positiveArrowColor}
									/>
									<Line
										worldUnits
										points={[
											0,
											root,
											linearFunctionBarXZ(root) - parametersLinearBarXZ.b,
											0,
											x[1] - linearFunctionLoad(x[1]),
											linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b
										]}
										lineWidth={0.02}
										color={loads[1] < 0 ? negativeArrowColor : positiveArrowColor}
									/>
								</>
							)
						}
					}
				} else {
					lines = (
						<>
							<Line
								worldUnits
								points={[
									x[0],
									-y[0] + linearFunctionBarXY(x[0]) - parametersLinearBarXY.b,
									linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b,
									root,
									linearFunctionBarXY(root) - parametersLinearBarXY.b,
									linearFunctionBarXZ(root) - parametersLinearBarXZ.b
								]}
								lineWidth={0.02}
								color={loads[0] < 0 ? negativeArrowColor : positiveArrowColor}
							/>
							<Line
								worldUnits
								points={[
									root,
									linearFunctionBarXY(root) - parametersLinearBarXY.b,
									linearFunctionBarXZ(root) - parametersLinearBarXZ.b,
									x[1],
									-y[1] + linearFunctionBarXY(x[1]) - parametersLinearBarXY.b,
									linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b
								]}
								lineWidth={0.02}
								color={loads[1] < 0 ? negativeArrowColor : positiveArrowColor}
							/>
						</>
					)
				}
				break
			case 'Fz':
				if (barPoints[0].x === barPoints[1].x) {
					if (!(barPoints[0].y === barPoints[1].y)) {
						lines = (
							<>
								<Line
									worldUnits
									points={[
										0,
										x[0],
										-y[0] + linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b,
										0,
										root,
										linearFunctionBarXZ(root) - parametersLinearBarXZ.b
									]}
									lineWidth={0.02}
									color={loads[0] < 0 ? negativeArrowColor : positiveArrowColor}
								/>
								<Line
									worldUnits
									points={[
										0,
										root,
										linearFunctionBarXZ(root) - parametersLinearBarXZ.b,
										0,
										x[1],
										-y[1] + linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b
									]}
									lineWidth={0.02}
									color={loads[1] < 0 ? negativeArrowColor : positiveArrowColor}
								/>
							</>
						)
					}
				} else {
					lines = (
						<>
							<Line
								worldUnits
								points={[
									x[0],
									linearFunctionBarXY(x[0]) - parametersLinearBarXY.b,
									-y[0] + linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b,
									root,
									linearFunctionBarXY(root) - parametersLinearBarXY.b,
									linearFunctionBarXZ(root) - parametersLinearBarXZ.b
								]}
								lineWidth={0.02}
								color={loads[0] < 0 ? negativeArrowColor : positiveArrowColor}
							/>
							<Line
								worldUnits
								points={[
									root,
									linearFunctionBarXY(root) - parametersLinearBarXY.b,
									linearFunctionBarXZ(root) - parametersLinearBarXZ.b,
									x[1],
									linearFunctionBarXY(x[1]) - parametersLinearBarXY.b,
									-y[1] + linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b
								]}
								lineWidth={0.02}
								color={loads[1] < 0 ? negativeArrowColor : positiveArrowColor}
							/>
						</>
					)
				}
				break
		}
	}

	let arrows: React.JSX.Element = <></>
	switch (forceDirection) {
		case 'Fx':
			if (barPoints[0].x === barPoints[1].x) {
				if (barPoints[0].y === barPoints[1].y) {
					arrows = (
						<>
							{xPositionsOfArrows.map((xPos) => {
								const yPos = linearFunctionLoad(xPos)
								if (Math.abs(yPos) < 0.1) return null
								return (
									<Arrow
										key={`${name}-${forceDirection}-${xPos}`}
										direction={yPos >= 0 ? 'x' : '-x'}
										position={[-yPos, 0, xPos]}
										length={Math.abs(yPos)}
										scale={0.3}
										color={yPos < 0 ? negativeArrowColor : positiveArrowColor}
									/>
								)
							})}
							<Billboard
								position={[
									-y[0],
									linearFunctionBarXY(x[0]) - parametersLinearBarXY.b,
									x[0] + linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b
								]}
							>
								<Text
									renderOrder={10}
									anchorX={'left'}
									font='/fonts/Inter-Regular.woff'
									fontSize={0.1}
								>
									{loads[0]}
									<meshBasicMaterial color={textColor} depthTest={false} />
								</Text>
							</Billboard>
							<Billboard
								position={[
									-y[1],
									linearFunctionBarXY(x[1]) - parametersLinearBarXY.b,
									x[1] + linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b
								]}
							>
								<Text
									renderOrder={10}
									anchorX={'left'}
									font='/fonts/Inter-Regular.woff'
									fontSize={0.1}
								>
									{loads[1]}
									<meshBasicMaterial color={textColor} depthTest={false} />
								</Text>
							</Billboard>
						</>
					)
				} else {
					arrows = (
						<>
							{xPositionsOfArrows.map((xPos) => {
								const yPos = linearFunctionLoad(xPos)
								if (Math.abs(yPos) < 0.1) return null
								return (
									<Arrow
										key={`${name}-${forceDirection}-${xPos}`}
										direction={yPos >= 0 ? 'x' : '-x'}
										position={[-yPos, xPos, linearFunctionBarXZ(xPos) - parametersLinearBarXZ.b]}
										length={Math.abs(yPos)}
										scale={0.3}
										color={yPos < 0 ? negativeArrowColor : positiveArrowColor}
									/>
								)
							})}
							<Billboard
								position={[
									-y[0],
									x[0] + linearFunctionBarXY(x[0]) - parametersLinearBarXY.b,
									linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b
								]}
							>
								<Text
									renderOrder={10}
									anchorX={'left'}
									font='/fonts/Inter-Regular.woff'
									fontSize={0.1}
								>
									{loads[0]}
									<meshBasicMaterial color={textColor} depthTest={false} />
								</Text>
							</Billboard>
							<Billboard
								position={[
									-y[1],
									x[1] + linearFunctionBarXY(x[1]) - parametersLinearBarXY.b,
									linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b
								]}
							>
								<Text
									renderOrder={10}
									anchorX={'left'}
									font='/fonts/Inter-Regular.woff'
									fontSize={0.1}
								>
									{loads[1]}
									<meshBasicMaterial color={textColor} depthTest={false} />
								</Text>
							</Billboard>
						</>
					)
				}
			} else {
				if (barPoints[0].y === barPoints[1].y && barPoints[0].z === barPoints[1].z) {
					arrows = (
						<>
							{xPositionsOfArrows.map((xPos) => {
								const yPos = linearFunctionLoad(xPos)
								let direction: 'x' | '-x' = yPos < 0 ? '-x' : 'x'
								if (yPos === 0)
									if (Math.abs(loads[0]) >= Math.abs(loads[1]))
										direction = loads[0] < 0 ? '-x' : 'x'
									else direction = loads[1] < 0 ? '-x' : 'x'
								return (
									<group key={`${name}-${forceDirection}-${xPos}`}>
										{yPos !== 0 && (
											<Arrow
												direction={yPos >= 0 ? 'x' : '-x'}
												position={[
													xPos - yPos,
													linearFunctionBarXY(xPos) - parametersLinearBarXY.b,
													linearFunctionBarXZ(xPos) - parametersLinearBarXZ.b
												]}
												length={Math.abs(yPos)}
												scale={(Math.abs(yPos) + 0.2) * 0.5}
												color={yPos < 0 ? negativeArrowColor : positiveArrowColor}
												notLine
											/>
										)}
										{((loads[0] > 0 && loads[1] < 0) || (loads[0] < 0 && loads[1] > 0)) &&
										yPos === 0 ? (
											<>
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
											</>
										) : yPos === 0 ? (
											<Arrow
												direction={direction}
												position={[xPos, 0, 0]}
												length={Math.abs(yPos)}
												scale={(Math.abs(yPos) + 0.2) * 0.5}
												color={direction === '-x' ? negativeArrowColor : positiveArrowColor}
												notLine
											/>
										) : null}
									</group>
								)
							})}
							<Billboard
								position={[
									x[0],
									linearFunctionBarXY(x[0]) - parametersLinearBarXY.b,
									linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b
								]}
							>
								<Text
									renderOrder={10}
									anchorX={'left'}
									font='/fonts/Inter-Regular.woff'
									fontSize={0.1}
								>
									{loads[0]}
									<meshBasicMaterial color={textColor} depthTest={false} />
								</Text>
							</Billboard>
							<Billboard
								position={[
									x[1],
									linearFunctionBarXY(x[1]) - parametersLinearBarXY.b,
									linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b
								]}
							>
								<Text
									renderOrder={10}
									anchorX={'left'}
									font='/fonts/Inter-Regular.woff'
									fontSize={0.1}
								>
									{loads[1]}
									<meshBasicMaterial color={textColor} depthTest={false} />
								</Text>
							</Billboard>
						</>
					)
				} else {
					arrows = (
						<>
							{xPositionsOfArrows.map((xPos) => {
								const yPos = linearFunctionLoad(xPos)
								if (Math.abs(yPos) < 0.1) return null
								return (
									<Arrow
										key={`${name}-${forceDirection}-${xPos}`}
										direction={yPos >= 0 ? 'x' : '-x'}
										position={[
											xPos - yPos,
											linearFunctionBarXY(xPos) - parametersLinearBarXY.b,
											linearFunctionBarXZ(xPos) - parametersLinearBarXZ.b
										]}
										length={Math.abs(yPos)}
										scale={0.3}
										color={yPos < 0 ? negativeArrowColor : positiveArrowColor}
									/>
								)
							})}
							<Billboard
								position={[
									x[0] - y[0],
									linearFunctionBarXY(x[0]) - parametersLinearBarXY.b,
									linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b
								]}
							>
								<Text
									renderOrder={10}
									anchorX={'left'}
									font='/fonts/Inter-Regular.woff'
									fontSize={0.1}
								>
									{loads[0]}
									<meshBasicMaterial color={textColor} depthTest={false} />
								</Text>
							</Billboard>
							<Billboard
								position={[
									x[1] - y[1],
									linearFunctionBarXY(x[1]) - parametersLinearBarXY.b,
									linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b
								]}
							>
								<Text
									renderOrder={10}
									anchorX={'left'}
									font='/fonts/Inter-Regular.woff'
									fontSize={0.1}
								>
									{loads[1]}
									<meshBasicMaterial color={textColor} depthTest={false} />
								</Text>
							</Billboard>
						</>
					)
				}
			}
			break
		case 'Fy':
			if (barPoints[0].x === barPoints[1].x) {
				if (barPoints[0].y === barPoints[1].y) {
					arrows = (
						<>
							{xPositionsOfArrows.map((xPos) => {
								const yPos = linearFunctionLoad(xPos)
								if (Math.abs(yPos) < 0.1) return null
								return (
									<group key={`${name}-${forceDirection}-${xPos}`}>
										<Arrow
											direction={yPos >= 0 ? 'y' : '-y'}
											position={[0, -yPos, xPos]}
											length={Math.abs(yPos)}
											scale={0.3}
											color={yPos < 0 ? negativeArrowColor : positiveArrowColor}
										/>
									</group>
								)
							})}
							<Billboard
								position={[
									0,
									-y[0] + linearFunctionBarXY(x[0]) - parametersLinearBarXY.b,
									x[0] + linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b
								]}
							>
								<Text
									renderOrder={10}
									anchorX={'left'}
									font='/fonts/Inter-Regular.woff'
									fontSize={0.1}
								>
									{loads[0]}
									<meshBasicMaterial color={textColor} depthTest={false} />
								</Text>
							</Billboard>
							<Billboard
								position={[
									0,
									-y[1] + linearFunctionBarXY(x[1]) - parametersLinearBarXY.b,
									x[1] + linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b
								]}
							>
								<Text
									renderOrder={10}
									anchorX={'left'}
									font='/fonts/Inter-Regular.woff'
									fontSize={0.1}
								>
									{loads[1]}
									<meshBasicMaterial color={textColor} depthTest={false} />
								</Text>
							</Billboard>
						</>
					)
				} else {
					if (barPoints[0].z === barPoints[1].z) {
						arrows = (
							<>
								{xPositionsOfArrows.map((xPos) => {
									const yPos = linearFunctionLoad(xPos)
									let direction: 'y' | '-y' = yPos < 0 ? '-y' : 'y'
									if (yPos === 0)
										if (Math.abs(loads[0]) >= Math.abs(loads[1]))
											direction = loads[0] < 0 ? '-y' : 'y'
										else direction = loads[1] < 0 ? '-y' : 'y'
									return (
										<group key={`${name}-${forceDirection}-${xPos}`}>
											{yPos !== 0 && (
												<Arrow
													direction={yPos >= 0 ? 'y' : '-y'}
													position={[
														0,
														xPos - yPos,
														linearFunctionBarXZ(xPos) - parametersLinearBarXZ.b
													]}
													length={Math.abs(yPos)}
													scale={(Math.abs(yPos) + 0.2) * 0.5}
													color={yPos < 0 ? negativeArrowColor : positiveArrowColor}
													notLine
												/>
											)}
											{((loads[0] > 0 && loads[1] < 0) || (loads[0] < 0 && loads[1] > 0)) &&
											yPos === 0 ? (
												<>
													<Arrow
														direction={loads[0] < 0 ? '-y' : 'y'}
														position={[0, xPos - 0.01 - (loads[0] < 0 ? 0.05 : 0), 0]}
														length={0}
														scale={0.2 * 0.5}
														color={loads[0] < 0 ? negativeArrowColor : positiveArrowColor}
														notLine
													/>
													<Arrow
														direction={loads[0] < 0 ? 'y' : '-y'}
														position={[0, xPos + 0.01 + (loads[0] < 0 ? 0.05 : 0), 0]}
														length={0}
														scale={0.2 * 0.5}
														color={loads[0] < 0 ? positiveArrowColor : negativeArrowColor}
														notLine
														endBase
													/>
												</>
											) : yPos === 0 ? (
												<Arrow
													direction={direction}
													position={[0, xPos, 0]}
													length={Math.abs(yPos)}
													scale={(Math.abs(yPos) + 0.2) * 0.5}
													color={direction === '-y' ? negativeArrowColor : positiveArrowColor}
													notLine
												/>
											) : null}
										</group>
									)
								})}
								<Billboard
									position={[
										0,
										x[0] + linearFunctionBarXY(x[0]) - parametersLinearBarXY.b,
										linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b
									]}
								>
									<Text
										renderOrder={10}
										anchorX={'left'}
										font='/fonts/Inter-Regular.woff'
										fontSize={0.1}
									>
										{loads[0]}
										<meshBasicMaterial color={textColor} depthTest={false} />
									</Text>
								</Billboard>
								<Billboard
									position={[
										0,
										x[1] + linearFunctionBarXY(x[1]) - parametersLinearBarXY.b,
										linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b
									]}
								>
									<Text
										renderOrder={10}
										anchorX={'left'}
										font='/fonts/Inter-Regular.woff'
										fontSize={0.1}
									>
										{loads[1]}
										<meshBasicMaterial color={textColor} depthTest={false} />
									</Text>
								</Billboard>
							</>
						)
					} else {
						arrows = (
							<>
								{xPositionsOfArrows.map((xPos) => {
									const yPos = linearFunctionLoad(xPos)
									if (Math.abs(yPos) < 0.1) return null
									return (
										<Arrow
											key={`${name}-${forceDirection}-${xPos}`}
											direction={yPos >= 0 ? 'y' : '-y'}
											position={[
												0,
												xPos - yPos,
												linearFunctionBarXZ(xPos) - parametersLinearBarXZ.b
											]}
											length={Math.abs(yPos)}
											scale={0.3}
											color={yPos < 0 ? negativeArrowColor : positiveArrowColor}
										/>
									)
								})}
								<Billboard
									position={[
										0,
										-y[0] + x[0] + linearFunctionBarXY(x[0]) - parametersLinearBarXY.b,
										linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b
									]}
								>
									<Text
										renderOrder={10}
										anchorX={'left'}
										font='/fonts/Inter-Regular.woff'
										fontSize={0.1}
									>
										{loads[0]}
										<meshBasicMaterial color={textColor} depthTest={false} />
									</Text>
								</Billboard>
								<Billboard
									position={[
										0,
										-y[1] + x[1] + linearFunctionBarXY(x[1]) - parametersLinearBarXY.b,
										linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b
									]}
								>
									<Text
										renderOrder={10}
										anchorX={'left'}
										font='/fonts/Inter-Regular.woff'
										fontSize={0.1}
									>
										{loads[1]}
										<meshBasicMaterial color={textColor} depthTest={false} />
									</Text>
								</Billboard>
							</>
						)
					}
				}
			} else {
				arrows = (
					<>
						{xPositionsOfArrows.map((xPos) => {
							const yPos = linearFunctionLoad(xPos)
							if (Math.abs(yPos) < 0.1) return null
							return (
								<Arrow
									key={`${name}-${forceDirection}-${xPos}`}
									direction={yPos >= 0 ? 'y' : '-y'}
									position={[
										xPos,
										-yPos + linearFunctionBarXY(xPos) - parametersLinearBarXY.b,
										linearFunctionBarXZ(xPos) - parametersLinearBarXZ.b
									]}
									length={Math.abs(yPos)}
									scale={0.3}
									color={yPos < 0 ? negativeArrowColor : positiveArrowColor}
								/>
							)
						})}
						<Billboard
							position={[
								x[0],
								-y[0] + linearFunctionBarXY(x[0]) - parametersLinearBarXY.b,
								linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b
							]}
						>
							<Text
								renderOrder={10}
								anchorX={'left'}
								font='/fonts/Inter-Regular.woff'
								fontSize={0.1}
							>
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
							<Text
								renderOrder={10}
								anchorX={'left'}
								font='/fonts/Inter-Regular.woff'
								fontSize={0.1}
							>
								{loads[1]}
								<meshBasicMaterial color={textColor} depthTest={false} />
							</Text>
						</Billboard>
					</>
				)
			}
			break
		case 'Fz':
			if (barPoints[0].x === barPoints[1].x) {
				if (barPoints[0].y === barPoints[1].y) {
					arrows = (
						<>
							{lines}
							{xPositionsOfArrows.map((xPos) => {
								const yPos = linearFunctionLoad(xPos)
								let direction: 'z' | '-z' = yPos < 0 ? '-z' : 'z'
								if (yPos === 0)
									if (Math.abs(loads[0]) >= Math.abs(loads[1]))
										direction = loads[0] < 0 ? '-z' : 'z'
									else direction = loads[1] < 0 ? '-z' : 'z'
								return (
									<group key={`${name}-${forceDirection}-${xPos}`}>
										{yPos !== 0 && (
											<Arrow
												direction={yPos >= 0 ? 'z' : '-z'}
												position={[0, 0, xPos - yPos]}
												length={Math.abs(yPos)}
												scale={(Math.abs(yPos) + 0.2) * 0.5}
												color={yPos < 0 ? negativeArrowColor : positiveArrowColor}
												notLine
											/>
										)}
										{((loads[0] > 0 && loads[1] < 0) || (loads[0] < 0 && loads[1] > 0)) &&
										yPos === 0 ? (
											<>
												<Arrow
													direction={loads[0] < 0 ? '-z' : 'z'}
													position={[0, 0, xPos - 0.01 - (loads[0] < 0 ? 0.05 : 0)]}
													length={0}
													scale={0.2 * 0.5}
													color={loads[0] < 0 ? negativeArrowColor : positiveArrowColor}
													notLine
												/>
												<Arrow
													direction={loads[0] < 0 ? 'z' : '-z'}
													position={[0, 0, xPos + 0.01 + (loads[0] < 0 ? 0.05 : 0)]}
													length={0}
													scale={0.2 * 0.5}
													color={loads[0] < 0 ? positiveArrowColor : negativeArrowColor}
													notLine
													endBase
												/>
											</>
										) : yPos === 0 ? (
											<Arrow
												direction={direction}
												position={[0, 0, xPos]}
												length={Math.abs(yPos)}
												scale={(Math.abs(yPos) + 0.2) * 0.5}
												color={direction === '-z' ? negativeArrowColor : positiveArrowColor}
												notLine
											/>
										) : null}
									</group>
								)
							})}
							<Billboard
								position={[
									0,
									linearFunctionBarXY(x[0]) - parametersLinearBarXY.b,
									x[0] + linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b
								]}
							>
								<Text
									renderOrder={10}
									anchorX={'left'}
									font='/fonts/Inter-Regular.woff'
									fontSize={0.1}
								>
									{loads[0]}
									<meshBasicMaterial color={textColor} depthTest={false} />
								</Text>
							</Billboard>
							<Billboard
								position={[
									0,
									linearFunctionBarXY(x[1]) - parametersLinearBarXY.b,
									x[1] + linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b
								]}
							>
								<Text
									renderOrder={10}
									anchorX={'left'}
									font='/fonts/Inter-Regular.woff'
									fontSize={0.1}
								>
									{loads[1]}
									<meshBasicMaterial color={textColor} depthTest={false} />
								</Text>
							</Billboard>
						</>
					)
				} else {
					arrows = (
						<>
							{lines}
							{xPositionsOfArrows.map((xPos) => {
								const yPos = linearFunctionLoad(xPos)
								if (Math.abs(yPos) < 0.1) return null
								return (
									<Arrow
										key={`${name}-${forceDirection}-${xPos}`}
										direction={yPos >= 0 ? 'z' : '-z'}
										position={[
											0,
											xPos,
											-yPos + linearFunctionBarXZ(xPos) - parametersLinearBarXZ.b
										]}
										length={Math.abs(yPos)}
										scale={0.3}
										color={yPos < 0 ? negativeArrowColor : positiveArrowColor}
									/>
								)
							})}
							<Billboard
								position={[
									0,
									x[0] + linearFunctionBarXY(x[0]) - parametersLinearBarXY.b,
									-y[0] + linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b
								]}
							>
								<Text
									renderOrder={10}
									anchorX={'left'}
									font='/fonts/Inter-Regular.woff'
									fontSize={0.1}
								>
									{loads[0]}
									<meshBasicMaterial color={textColor} depthTest={false} />
								</Text>
							</Billboard>
							<Billboard
								position={[
									0,
									x[1] + linearFunctionBarXY(x[1]) - parametersLinearBarXY.b,
									-y[1] + linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b
								]}
							>
								<Text
									renderOrder={10}
									anchorX={'left'}
									font='/fonts/Inter-Regular.woff'
									fontSize={0.1}
								>
									{loads[1]}
									<meshBasicMaterial color={textColor} depthTest={false} />
								</Text>
							</Billboard>
						</>
					)
				}
			} else {
				arrows = (
					<>
						{lines}
						{xPositionsOfArrows.map((xPos) => {
							const yPos = linearFunctionLoad(xPos)
							if (Math.abs(yPos) < 0.1) return null
							return (
								<Arrow
									key={`${name}-${forceDirection}-${xPos}`}
									direction={yPos >= 0 ? 'z' : '-z'}
									position={[
										xPos,
										linearFunctionBarXY(xPos) - parametersLinearBarXY.b,
										-yPos + linearFunctionBarXZ(xPos) - parametersLinearBarXZ.b
									]}
									length={Math.abs(yPos)}
									scale={0.3}
									color={yPos < 0 ? negativeArrowColor : positiveArrowColor}
								/>
							)
						})}
						<Billboard
							position={[
								x[0],
								linearFunctionBarXY(x[0]) - parametersLinearBarXY.b,
								-y[0] + linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b
							]}
						>
							<Text
								renderOrder={10}
								anchorX={'left'}
								font='/fonts/Inter-Regular.woff'
								fontSize={0.1}
							>
								{loads[0]}
								<meshBasicMaterial color={textColor} depthTest={false} />
							</Text>
						</Billboard>
						<Billboard
							position={[
								x[1],
								linearFunctionBarXY(x[1]) - parametersLinearBarXY.b,
								-y[1] + linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b
							]}
						>
							<Text
								renderOrder={10}
								anchorX={'left'}
								font='/fonts/Inter-Regular.woff'
								fontSize={0.1}
							>
								{loads[1]}
								<meshBasicMaterial color={textColor} depthTest={false} />
							</Text>
						</Billboard>
					</>
				)
			}
	}

	return (
		<group position={barPoints[0]}>
			{/* Forces ///////////////////////////////////////////////////////////////////////////////*/}
			{arrows}
			{lines}
		</group>
	)
}
