import {
	FixedDisplacement,
	FixedRotation,
	SpringDisplacement,
	SpringRotation
} from '@renderer/components/3d/objects/Supports'
import { IStructureData, ISupportData } from '@renderer/types/Structure'
import { FixedAll } from './FixedAll'
import { FixedAllDisplacement } from './FixedAllDisplacement'

export const DrawSupport = (
	support: ISupportData,
	structure: IStructureData
): React.JSX.Element[] => {
	let basePoint: [number, number, number] = [0, 0, 0]
	let isError = true

	if (structure) {
		for (const node of structure.nodes) {
			if (node.name === support.node) {
				basePoint = node.position
				isError = false
				break
			}
		}
		if (isError) throw new Error('O nó do apoio não existe.')
	}

	const drawings: React.JSX.Element[] = []

	if (!Object.values(support.supports).some((value) => value === false)) {
		drawings.push(<FixedAll key={'DrawSupport-fixedAll'} position={basePoint} />)
		return drawings
	}

	if (
		support.supports.Dx &&
		support.supports.Dy &&
		support.supports.Dz &&
		!support.supports.Rx &&
		!support.supports.Ry &&
		!support.supports.Rz
	) {
		drawings.push(
			<FixedAllDisplacement key={'DrawSupport-OnlyDisplacement'} position={basePoint} />
		)
		return drawings
	}

	for (const [key, value] of Object.entries(support.supports)) {
		if (key === 'Dx') {
			if (typeof value === 'boolean' && value) {
				drawings.push(
					<FixedDisplacement
						key={`${support.node}${key}`}
						position={basePoint}
						direction='Dx'
						color='red'
					/>
				)
			} else if (typeof value === 'number') {
				drawings.push(
					<SpringDisplacement
						label
						key={`${support.node}${key}`}
						value={value}
						position={basePoint}
						direction='Dx'
						color='red'
					/>
				)
			}
		} else if (key === 'Dy') {
			if (typeof value === 'boolean' && value) {
				drawings.push(
					<FixedDisplacement
						key={`${support.node}${key}`}
						position={basePoint}
						direction='Dy'
						color='green'
					/>
				)
			} else if (typeof value === 'number') {
				drawings.push(
					<SpringDisplacement
						label
						key={`${support.node}${key}`}
						value={value}
						position={basePoint}
						direction='Dy'
						color='green'
					/>
				)
			}
		} else if (key === 'Dz') {
			if (typeof value === 'boolean' && value) {
				drawings.push(
					<FixedDisplacement
						key={`${support.node}${key}`}
						position={basePoint}
						direction='Dz'
						color='blue'
					/>
				)
			} else if (typeof value === 'number') {
				drawings.push(
					<SpringDisplacement
						label
						key={`${support.node}${key}`}
						value={value}
						position={basePoint}
						direction='Dz'
						color='blue'
					/>
				)
			}
		} else if (key === 'Rx') {
			if (typeof value === 'boolean' && value) {
				drawings.push(
					<FixedRotation
						key={`${support.node}${key}`}
						position={basePoint}
						direction='Rx'
						color='red'
					/>
				)
			} else if (typeof value === 'number') {
				drawings.push(
					<SpringRotation
						key={`${support.node}${key}`}
						value={value}
						position={basePoint}
						direction='Rx'
						color='red'
					/>
				)
			}
		} else if (key === 'Ry') {
			if (typeof value === 'boolean' && value) {
				drawings.push(
					<FixedRotation
						key={`${support.node}${key}`}
						position={basePoint}
						direction='Ry'
						color='green'
					/>
				)
			} else if (typeof value === 'number') {
				drawings.push(
					<SpringRotation
						key={`${support.node}${key}`}
						value={value}
						position={basePoint}
						direction='Ry'
						color='green'
					/>
				)
			}
		} else if (key === 'Rz') {
			if (typeof value === 'boolean' && value) {
				drawings.push(
					<FixedRotation
						key={`${support.node}${key}`}
						position={basePoint}
						direction='Rz'
						color='blue'
					/>
				)
			} else if (typeof value === 'number') {
				drawings.push(
					<SpringRotation
						key={`${support.node}${key}`}
						value={value}
						position={basePoint}
						direction='Rz'
						color='blue'
					/>
				)
			}
		}
	}

	return drawings
}
