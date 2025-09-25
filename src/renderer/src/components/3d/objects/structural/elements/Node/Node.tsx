/**
 * Node component representing a structural node with loads if applicable
 */
import { Point, Points } from '@react-three/drei'
import { useStructureContext } from '@renderer/contexts/Structure'
import { INodeData } from '@renderer/types/Structure'
import { Vector3 } from 'three'
import { PointLoad } from '../../loads'
import { useSceneContext } from '@renderer/contexts/Scene'
import { click } from '@renderer/core/select'
import { IEntityData } from '@renderer/types/Entity'

interface INodeProps {
	node: INodeData
}

export const Node = ({ node }: INodeProps): React.JSX.Element => {
	const { structure } = useStructureContext()

	const { view } = useSceneContext()
	const [viewNodes] = view.nodes
	const [viewNodalLoads] = view.nodalLoads

	const position = new Vector3(node.position[0], node.position[1], node.position[2])

	if (!viewNodes) return <></>

	return (
		<>
			<>
				<Points key={node.name} limit={1} range={1}>
					<pointsMaterial vertexColors size={0.1} />
					<Point
						name={`node-${node.name}`}
						userData={{ type: 'node', name: node.name } as IEntityData}
						position={position}
						color={'magenta'}
						onClick={(event) => click(event, event.object.userData)}
					/>
				</Points>
				{viewNodalLoads &&
					structure?.loads.map((load) => {
						const nodalLoad = load.nodes.find((nodalLoad) => nodalLoad.node === node.name)
						return (
							nodalLoad && (
								<PointLoad
									key={`${load.name}-${nodalLoad.name}`}
									label
									position={structure?.nodes.find((node) => node.name === nodalLoad.node)?.position}
									fx={nodalLoad.loads.Fx}
									fy={nodalLoad.loads.Fy}
									fz={nodalLoad.loads.Fz}
									mx={nodalLoad.loads.Mx}
									my={nodalLoad.loads.My}
									mz={nodalLoad.loads.Mz}
								/>
							)
						)
					})}
			</>
		</>
	)
}
