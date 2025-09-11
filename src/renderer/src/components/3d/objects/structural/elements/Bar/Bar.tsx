import { Line } from '@react-three/drei'
import { useStructureContext } from '@renderer/contexts/Structure'
import { forcesType, IBarData } from '@renderer/types/Structure'
import * as THREE from 'three'
import { degToRad } from 'three/src/math/MathUtils'
import { BarDistributedLoad, PointBarLoad } from '../../loads'
import { LocalAxes } from '../../others/LocalAxes'
import { BarRelease } from '../../others'

interface IBarProps {
	bar: IBarData
}

export const Bar = ({ bar }: IBarProps): React.JSX.Element => {
	const { structure } = useStructureContext()

	const startPoint = new THREE.Vector3()
	const endPoint = new THREE.Vector3()
	const rotation = degToRad(bar.rotation)

	for (const node of structure.nodes) {
		if (node.name == bar.start_node) {
			startPoint.set(node.position[0], node.position[1], node.position[2])
		} else if (node.name == bar.end_node) {
			endPoint.set(node.position[0], node.position[1], node.position[2])
		}
	}

	const middlePoint = new THREE.Vector3().subVectors(endPoint, startPoint)
	middlePoint.divideScalar(2)
	middlePoint.addVectors(middlePoint, startPoint)

	const direction = new THREE.Vector3().subVectors(endPoint, startPoint).normalize()

	return (
		<>
			<Line
				// worldUnits
				name={bar.name}
				points={[startPoint, endPoint]}
				color={'orange'}
				lineWidth={2}
			/>
			<LocalAxes
				direction={direction}
				rotationAroundDirection={degToRad(bar.rotation)}
				label
				scale={0.25}
				position={middlePoint}
			/>
			<BarRelease
				releases={bar.releases}
				direction={direction}
				startPoint={startPoint}
				endPoint={endPoint}
				barRotation={rotation}
			/>
			{/* Point Loads */}
			{structure.loads.map((load) => {
				return load.bars.point.map((barPointLoad) => {
					if (barPointLoad.bar == bar.name)
						return (
							<PointBarLoad
								key={barPointLoad.name}
								direction={direction}
								xPosition={barPointLoad.position}
								rotationAroundDirection={rotation}
								position={startPoint}
								system={barPointLoad.system}
								fx={barPointLoad.loads.Fx}
								fy={barPointLoad.loads.Fy}
								fz={barPointLoad.loads.Fz}
								mx={barPointLoad.loads.Mx}
								my={barPointLoad.loads.My}
								mz={barPointLoad.loads.Mz}
							/>
						)
					return null
				})
			})}
			{/* Distributed Loads */}
			{structure.loads.map((load) => {
				return load.bars.distributed.map((barDistributedLoad) => {
					if (barDistributedLoad.bar == bar.name) {
						return Object.entries(barDistributedLoad.loads).map(([objectKey, objectValue]) => {
							const key = objectKey as forcesType
							return (
								<BarDistributedLoad
									key={`${barDistributedLoad.name}-${key}-${Math.random()}`}
									name={barDistributedLoad.name}
									direction={direction}
									loads={objectValue}
									forceDirection={key}
									xPositions={barDistributedLoad.position}
									position={startPoint}
									system={barDistributedLoad.system}
									rotationAroundDirection={rotation}
									barPoints={[startPoint, endPoint]}
								/>
							)
						})
					}
					return null
				})
			})}
		</>
	)
}
