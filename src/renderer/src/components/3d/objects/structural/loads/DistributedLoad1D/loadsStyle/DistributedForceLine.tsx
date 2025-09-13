import { Billboard, Line, Text } from '@react-three/drei'
import { Arrow } from '@renderer/components/3d/objects/Arrow'
import { linSpace } from '@renderer/utils/functions/others'
import * as space2D from '@renderer/utils/functions/space2D'
import { Vector3 } from 'three'
import * as matrix from '@renderer/utils/functions/matrix'

interface IDistributedForceLineProps {
	name: string
	forceDirection: 'Fx' | 'Fy' | 'Fz'
	loads: [number, number]
	xPositions: [number, number]
	barPoints: [Vector3, Vector3]

	size?: number
	textColor?: string
	positiveArrowColor?: string
	negativeArrowColor?: string
}

export const DistributedForceLine = ({
	name,
	forceDirection,
	loads,
	xPositions,
	barPoints,
	size = 1,
	positiveArrowColor = 'green',
	negativeArrowColor = 'red',
	textColor = 'cyan'
}: IDistributedForceLineProps): React.JSX.Element => {
	const rotationMatrix = matrix.createRotationMatrix(barPoints)

	const globalXPositions: [number, number] = [
		matrix.multiply(rotationMatrix, [[xPositions[0]], [0], [0]])[0][0],
		matrix.multiply(rotationMatrix, [[xPositions[1]], [0], [0]])[0][0]
	]
	const globalYPositions: [number, number] = [
		matrix.multiply(rotationMatrix, [[0], [xPositions[0]], [0]])[0][0],
		matrix.multiply(rotationMatrix, [[0], [xPositions[1]], [0]])[0][0]
	]
	const globalZPositions: [number, number] = [
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
	numberOfArrows = Math.max(numberOfArrows % 2 === 0 ? numberOfArrows - 1 : numberOfArrows, 3)
	const scaleToHeight = size / Math.max(Math.abs(loads[0]), Math.abs(loads[1]))
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
	let positiveDirection: 'x' | 'y' | 'z' = 'x'
	let negativeDirection: '-x' | '-y' | '-z' = '-x'
	switch (forceDirection) {
		case 'Fx':
			positiveDirection = 'x'
			negativeDirection = '-x'
			break
		case 'Fy':
			positiveDirection = 'y'
			negativeDirection = '-y'
			break
		case 'Fz':
			positiveDirection = 'z'
			negativeDirection = '-z'
			break
	}

	// Create the line of the distributed load in Fy or Fz direction
	let lines: React.JSX.Element = <></>
	if ((loads[0] >= 0 && loads[1] >= 0) || (loads[0] <= 0 && loads[1] <= 0)) {
		if (barPoints[0].x === barPoints[1].x) {
			if (barPoints[0].y === barPoints[1].y) {
				lines = (
					<Line
						worldUnits
						points={[
							forceDirection == 'Fx' ? -y[0] : 0,
							forceDirection == 'Fy' ? -y[0] : 0,
							(forceDirection == 'Fz' ? -y[0] : 0) + x[0],
							forceDirection == 'Fx' ? -y[1] : 0,
							forceDirection == 'Fy' ? -y[1] : 0,
							(forceDirection == 'Fz' ? -y[1] : 0) + x[1]
						]}
						lineWidth={0.02}
						color={loads[0] >= 0 && loads[1] >= 0 ? positiveArrowColor : negativeArrowColor}
					/>
				)
			} else {
				lines = (
					<Line
						worldUnits
						points={[
							forceDirection == 'Fx' ? -y[0] : 0,
							(forceDirection == 'Fy' ? -y[0] : 0) + x[0],
							(forceDirection == 'Fz' ? -y[0] : 0) +
								linearFunctionBarXZ(x[0]) -
								parametersLinearBarXZ.b,
							forceDirection == 'Fx' ? -y[1] : 0,
							(forceDirection == 'Fy' ? -y[1] : 0) + x[1],
							(forceDirection == 'Fz' ? -y[1] : 0) +
								linearFunctionBarXZ(x[1]) -
								parametersLinearBarXZ.b
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
						(forceDirection == 'Fx' ? -y[0] : 0) + x[0],
						(forceDirection == 'Fy' ? -y[0] : 0) +
							linearFunctionBarXY(x[0]) -
							parametersLinearBarXY.b,
						(forceDirection == 'Fz' ? -y[0] : 0) +
							linearFunctionBarXZ(x[0]) -
							parametersLinearBarXZ.b,
						(forceDirection == 'Fx' ? -y[1] : 0) + x[1],
						(forceDirection == 'Fy' ? -y[1] : 0) +
							linearFunctionBarXY(x[1]) -
							parametersLinearBarXY.b,
						(forceDirection == 'Fz' ? -y[1] : 0) +
							linearFunctionBarXZ(x[1]) -
							parametersLinearBarXZ.b
					]}
					lineWidth={0.02}
					color={loads[0] >= 0 && loads[1] >= 0 ? positiveArrowColor : negativeArrowColor}
				/>
			)
		}
	} else {
		const root = space2D.rootLinear([x[0], y[0]], [x[1], y[1]])
		if (barPoints[0].x === barPoints[1].x) {
			if (barPoints[0].y === barPoints[1].y) {
				lines = (
					<>
						<Line
							worldUnits
							points={[
								forceDirection == 'Fx' ? -y[0] : 0,
								forceDirection == 'Fy' ? -y[0] : 0,
								(forceDirection == 'Fz' ? -y[0] : 0) + x[0],
								0,
								0,
								root
							]}
							lineWidth={0.02}
							color={loads[0] < 0 ? negativeArrowColor : positiveArrowColor}
						/>
						<Line
							worldUnits
							points={[
								0,
								0,
								root,
								forceDirection == 'Fx' ? -y[1] : 0,
								forceDirection == 'Fy' ? -y[1] : 0,
								(forceDirection == 'Fz' ? -y[1] : 0) + x[1]
							]}
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
								forceDirection == 'Fx' ? -y[0] : 0,
								(forceDirection == 'Fy' ? -y[0] : 0) + x[0],
								(forceDirection == 'Fz' ? -y[0] : 0) +
									linearFunctionBarXZ(x[0]) -
									parametersLinearBarXZ.b,
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
								forceDirection == 'Fx' ? -y[1] : 0,
								(forceDirection == 'Fy' ? -y[1] : 0) + x[1],
								(forceDirection == 'Fz' ? -y[1] : 0) +
									linearFunctionBarXZ(x[1]) -
									parametersLinearBarXZ.b
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
							(forceDirection == 'Fx' ? -y[0] : 0) + x[0],
							(forceDirection == 'Fy' ? -y[0] : 0) +
								linearFunctionBarXY(x[0]) -
								parametersLinearBarXY.b,
							(forceDirection == 'Fz' ? -y[0] : 0) +
								linearFunctionBarXZ(x[0]) -
								parametersLinearBarXZ.b,
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
							(forceDirection == 'Fx' ? -y[1] : 0) + x[1],
							(forceDirection == 'Fy' ? -y[1] : 0) +
								linearFunctionBarXY(x[1]) -
								parametersLinearBarXY.b,
							(forceDirection == 'Fz' ? -y[1] : 0) +
								linearFunctionBarXZ(x[1]) -
								parametersLinearBarXZ.b
						]}
						lineWidth={0.02}
						color={loads[1] < 0 ? negativeArrowColor : positiveArrowColor}
					/>
				</>
			)
		}
	}

	let arrows: React.JSX.Element = <></>
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
								direction={yPos >= 0 ? positiveDirection : negativeDirection}
								position={[
									forceDirection == 'Fx' ? -yPos : 0,
									forceDirection == 'Fy' ? -yPos : 0,
									(forceDirection == 'Fz' ? -yPos : 0) + xPos
								]}
								length={Math.abs(yPos)}
								scale={0.3}
								color={yPos < 0 ? negativeArrowColor : positiveArrowColor}
							/>
						)
					})}
					<Billboard
						position={[
							forceDirection == 'Fx' ? -y[0] : 0,
							(forceDirection == 'Fy' ? -y[0] : 0) +
								linearFunctionBarXY(x[0]) -
								parametersLinearBarXY.b,
							(forceDirection == 'Fz' ? -y[0] : 0) +
								x[0] +
								linearFunctionBarXZ(x[0]) -
								parametersLinearBarXZ.b
						]}
					>
						<Text renderOrder={10} anchorX={'left'} font='/fonts/Inter-Regular.woff' fontSize={0.1}>
							{loads[0]}
							<meshBasicMaterial color={textColor} depthTest={false} />
						</Text>
					</Billboard>
					<Billboard
						position={[
							forceDirection == 'Fx' ? -y[1] : 0,
							(forceDirection == 'Fy' ? -y[1] : 0) +
								linearFunctionBarXY(x[1]) -
								parametersLinearBarXY.b,
							(forceDirection == 'Fz' ? -y[1] : 0) +
								x[1] +
								linearFunctionBarXZ(x[1]) -
								parametersLinearBarXZ.b
						]}
					>
						<Text renderOrder={10} anchorX={'left'} font='/fonts/Inter-Regular.woff' fontSize={0.1}>
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
								direction={yPos >= 0 ? positiveDirection : negativeDirection}
								position={[
									forceDirection == 'Fx' ? -yPos : 0,
									(forceDirection == 'Fy' ? -yPos : 0) + xPos,
									(forceDirection == 'Fz' ? -yPos : 0) +
										linearFunctionBarXZ(xPos) -
										parametersLinearBarXZ.b
								]}
								length={Math.abs(yPos)}
								scale={0.3}
								color={yPos < 0 ? negativeArrowColor : positiveArrowColor}
							/>
						)
					})}
					<Billboard
						position={[
							forceDirection == 'Fx' ? -y[0] : 0,
							(forceDirection == 'Fy' ? -y[0] : 0) +
								x[0] +
								linearFunctionBarXY(x[0]) -
								parametersLinearBarXY.b,
							(forceDirection == 'Fz' ? -y[0] : 0) +
								linearFunctionBarXZ(x[0]) -
								parametersLinearBarXZ.b
						]}
					>
						<Text renderOrder={10} anchorX={'left'} font='/fonts/Inter-Regular.woff' fontSize={0.1}>
							{loads[0]}
							<meshBasicMaterial color={textColor} depthTest={false} />
						</Text>
					</Billboard>
					<Billboard
						position={[
							forceDirection == 'Fx' ? -y[1] : 0,
							(forceDirection == 'Fy' ? -y[1] : 0) +
								x[1] +
								linearFunctionBarXY(x[1]) -
								parametersLinearBarXY.b,
							(forceDirection == 'Fz' ? -y[1] : 0) +
								linearFunctionBarXZ(x[1]) -
								parametersLinearBarXZ.b
						]}
					>
						<Text renderOrder={10} anchorX={'left'} font='/fonts/Inter-Regular.woff' fontSize={0.1}>
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
				{xPositionsOfArrows.map((xPos) => {
					const yPos = linearFunctionLoad(xPos)
					if (Math.abs(yPos) < 0.1) return null
					return (
						<Arrow
							key={`${name}-${forceDirection}-${xPos}`}
							direction={yPos >= 0 ? positiveDirection : negativeDirection}
							position={[
								(forceDirection == 'Fx' ? -yPos : 0) + xPos,
								(forceDirection == 'Fy' ? -yPos : 0) +
									linearFunctionBarXY(xPos) -
									parametersLinearBarXY.b,
								(forceDirection == 'Fz' ? -yPos : 0) +
									linearFunctionBarXZ(xPos) -
									parametersLinearBarXZ.b
							]}
							length={Math.abs(yPos)}
							scale={0.3}
							color={yPos < 0 ? negativeArrowColor : positiveArrowColor}
						/>
					)
				})}
				<Billboard
					position={[
						(forceDirection == 'Fx' ? -y[0] : 0) + x[0],
						(forceDirection == 'Fy' ? -y[0] : 0) +
							linearFunctionBarXY(x[0]) -
							parametersLinearBarXY.b,
						(forceDirection == 'Fz' ? -y[0] : 0) +
							linearFunctionBarXZ(x[0]) -
							parametersLinearBarXZ.b
					]}
				>
					<Text renderOrder={10} anchorX={'left'} font='/fonts/Inter-Regular.woff' fontSize={0.1}>
						{loads[0]}
						<meshBasicMaterial color={textColor} depthTest={false} />
					</Text>
				</Billboard>
				<Billboard
					position={[
						(forceDirection == 'Fx' ? -y[1] : 0) + x[1],
						(forceDirection == 'Fy' ? -y[1] : 0) +
							linearFunctionBarXY(x[1]) -
							parametersLinearBarXY.b,
						(forceDirection == 'Fz' ? -y[1] : 0) +
							linearFunctionBarXZ(x[1]) -
							parametersLinearBarXZ.b
					]}
				>
					<Text renderOrder={10} anchorX={'left'} font='/fonts/Inter-Regular.woff' fontSize={0.1}>
						{loads[1]}
						<meshBasicMaterial color={textColor} depthTest={false} />
					</Text>
				</Billboard>
			</>
		)
	}

	return (
		<group position={barPoints[0]}>
			{arrows}
			{lines}
		</group>
	)
}
