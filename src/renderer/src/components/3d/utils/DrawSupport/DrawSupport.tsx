import {
	FixedDisplacement,
	FixedRotation,
	SpringDisplacement,
	SpringRotation
} from '@renderer/components/3d/objects/Supports'
import { useStructureContext } from '@renderer/contexts/Structure'
import { ISupportData } from '@renderer/types/Structure'

export const DrawSupport = (support: ISupportData): React.JSX.Element[] => {
	const { structure } = useStructureContext()

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

	for (const [key, value] of Object.entries(support.supports)) {
		if (key === 'Dx') {
			if (typeof value === 'boolean' && value) {
				drawings.push(
					<FixedDisplacement
						key={`${support.node}${key}`}
						basePoint={basePoint}
						direction='Dx'
					/>
				)
			} else if (typeof value === 'number') {
				drawings.push(
					<SpringDisplacement
						key={`${support.node}${key}`}
						basePoint={basePoint}
						direction='Dx'
					/>
				)
			}
		} else if (key === 'Dy') {
			if (typeof value === 'boolean' && value) {
				drawings.push(
					<FixedDisplacement
						key={`${support.node}${key}`}
						basePoint={basePoint}
						direction='Dy'
					/>
				)
			} else if (typeof value === 'number') {
				drawings.push(
					<SpringDisplacement
						key={`${support.node}${key}`}
						basePoint={basePoint}
						direction='Dy'
					/>
				)
			}
		} else if (key === 'Dz') {
			if (typeof value === 'boolean' && value) {
				drawings.push(
					<FixedDisplacement
						key={`${support.node}${key}`}
						basePoint={basePoint}
						direction='Dz'
					/>
				)
			} else if (typeof value === 'number') {
				drawings.push(
					<SpringDisplacement
						key={`${support.node}${key}`}
						basePoint={basePoint}
						direction='Dz'
					/>
				)
			}
		} else if (key === 'Rx') {
			if (typeof value === 'boolean' && value) {
				drawings.push(
					<FixedRotation
						key={`${support.node}${key}`}
						basePoint={basePoint}
						direction='Rx'
					/>
				)
			} else if (typeof value === 'number') {
				drawings.push(
					<SpringRotation
						key={`${support.node}${key}`}
						basePoint={basePoint}
						direction='Rx'
					/>
				)
			}
		} else if (key === 'Ry') {
			if (typeof value === 'boolean' && value) {
				drawings.push(
					<FixedRotation
						key={`${support.node}${key}`}
						basePoint={basePoint}
						direction='Ry'
					/>
				)
			} else if (typeof value === 'number') {
				drawings.push(
					<SpringRotation
						key={`${support.node}${key}`}
						basePoint={basePoint}
						direction='Ry'
					/>
				)
			}
		} else if (key === 'Rz') {
			if (typeof value === 'boolean' && value) {
				drawings.push(
					<FixedRotation
						key={`${support.node}${key}`}
						basePoint={basePoint}
						direction='Rz'
					/>
				)
			} else if (typeof value === 'number') {
				drawings.push(
					<SpringRotation
						key={`${support.node}${key}`}
						basePoint={basePoint}
						direction='Rz'
					/>
				)
			}
		}
	}

	return drawings
}
