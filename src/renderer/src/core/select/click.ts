import { ThreeEvent } from '@react-three/fiber'
import { IEntityData } from '@renderer/types/Entity'
import { IStructureData } from '@renderer/types/Structure'

export const click = (
	event: ThreeEvent<MouseEvent>,
	useData: IEntityData,
	structureData: IStructureData
): void => {
	event.stopPropagation()
	if (useData.type === 'node') {
		console.log(
			structureData.results
				.find((result) => result.load_case === 'L1')
				?.displacements.find((displacement) => displacement.node === useData.name)
		)
	}
	// console.log(useData)
	// console.log(structureData)
}
