import { ThreeEvent } from '@react-three/fiber'
import { IEntityData } from '@renderer/types/Entity'
import { IStructureData } from '@renderer/types/Structure'

export const click = (
	event: ThreeEvent<MouseEvent>,
	useData: IEntityData,
	structureData: IStructureData
): void => {
	event.stopPropagation()
	if (!structureData.results) {
		window.alert('No results available. Please open a calculated structure.')
		return
	}
	if (useData.type === 'node') {
		console.log(
			structureData.results
				.find((result) => result.load_case === 'L1')
				?.displacements.find((displacement) => displacement.node === useData.name)
		)
	}
}
