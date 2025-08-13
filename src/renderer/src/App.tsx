import { useEffect, useRef, useState } from 'react'
import { Default3dScene } from './components/3d'
import { Node } from './components/3d/objects'
import { Bar } from './components/3d/objects/Bar'
import { DrawSupport } from './components/3d/utils'
import { useStructureContext } from './contexts/Structure'
import { IStructureData } from './types/Structure'
import { Billboard, Circle, Line, Text } from '@react-three/drei'
import { Group } from 'three'

export const App = (): React.JSX.Element => {
	const [structureData, setStructureData] = useState<IStructureData | null>()
	const { structure } = useStructureContext()

	const labelXNegative = useRef<Group>(null)
	const labelYNegative = useRef<Group>(null)
	const labelZNegative = useRef<Group>(null)

	useEffect(() => {
		const disposeOpenFile = window.electron.ipcRenderer.on(
			'open-file',
			(_event, data: IStructureData) => {
				setStructureData(data)
				structure.nodes = data.nodes
				structure.bars = data.bars
				structure.supports = data.supports
			}
		)

		return () => {
			disposeOpenFile()
		}
	}, [structure])

	return (
		<Default3dScene>
			{structureData?.bars.map((bar) => <Bar key={bar.name} bar={bar} />)}
			{structureData?.nodes.map((node) => <Node key={node.name} node={node} />)}
			{structureData?.supports.map((support) => DrawSupport(support))}

			<group>
				<Line
					worldUnits
					points={[0, 0, 0, 0.31, 0, 0]}
					color={'#ff3653'}
					lineWidth={0.02}
				/>
				<Billboard position={[0.4, 0, 0]}>
					<Text font='/fonts/Inter-Bold.woff' color={'black'} fontSize={0.14}>
						X
					</Text>
					<Circle scale={0.1}>
						<meshBasicMaterial color={'#ff3653'} />
					</Circle>
				</Billboard>
			</group>
			<group rotation-z={Math.PI * 0.5}>
				<Line
					worldUnits
					points={[0, 0, 0, 0.31, 0, 0]}
					color={'#77b316'}
					lineWidth={0.02}
				/>
				<Billboard position={[0.4, 0, 0]}>
					<Text font='/fonts/Inter-Bold.woff' color={'black'} fontSize={0.14}>
						Y
					</Text>
					<Circle scale={0.1}>
						<meshBasicMaterial color={'#77b316'} />
					</Circle>
				</Billboard>
			</group>
			<group rotation-y={-Math.PI * 0.5}>
				<Line
					worldUnits
					points={[0, 0, 0, 0.31, 0, 0]}
					color={'#317acd'}
					lineWidth={0.02}
				/>
				<Billboard position={[0.4, 0, 0]}>
					<Text font='/fonts/Inter-Bold.woff' color={'black'} fontSize={0.14}>
						Z
					</Text>
					<Circle scale={0.1}>
						<meshBasicMaterial color={'#317acd'} />
					</Circle>
				</Billboard>
			</group>
			<group rotation-z={Math.PI}>
				{/* <Line
					worldUnits
					points={[0, 0, 0, 0.31, 0, 0]}
					color={'#ff3653'}
					lineWidth={0.02}
					depthTest={false}
					depthWrite={false}
				/> */}
				<Billboard position={[0.4, 0, 0]}>
					<group ref={labelXNegative} visible={false}>
						<Text font='/fonts/Inter-Bold.woff' color={'white'} fontSize={0.14}>
							-X
						</Text>
					</group>
					<Circle
						scale={0.1}
						onPointerEnter={(event) => {
							event.stopPropagation()
							if (labelXNegative.current) labelXNegative.current.visible = true
						}}
						onPointerLeave={() => {
							if (labelXNegative.current) labelXNegative.current.visible = false
						}}
					>
						<meshBasicMaterial color={'#ff3653'} />
					</Circle>
					<Circle scale={0.09}>
						<meshBasicMaterial color={'#292929'} />
					</Circle>
				</Billboard>
			</group>
			<group rotation-z={-Math.PI / 2}>
				{/* <Line
					worldUnits
					points={[0, 0, 0, 0.31, 0, 0]}
					color={'#77b316'}
					lineWidth={0.02}
					depthTest={false}
					depthWrite={false}
				/> */}
				<Billboard position={[0.4, 0, 0]}>
					<group ref={labelYNegative} visible={false}>
						<Text font='/fonts/Inter-Bold.woff' color={'white'} fontSize={0.14}>
							-Y
						</Text>
					</group>
					<Circle
						scale={0.1}
						onPointerEnter={(event) => {
							event.stopPropagation()
							if (labelYNegative.current) labelYNegative.current.visible = true
						}}
						onPointerLeave={() => {
							if (labelYNegative.current) labelYNegative.current.visible = false
						}}
					>
						<meshBasicMaterial color={'#77b316'} />
					</Circle>
					<Circle scale={0.09}>
						<meshBasicMaterial color={'#292929'} />
					</Circle>
				</Billboard>
			</group>
			<group rotation-y={Math.PI / 2}>
				{/* <Line
					worldUnits
					points={[0, 0, 0, 0.31, 0, 0]}
					color={'#317acd'}
					lineWidth={0.02}
					depthTest={false}
					depthWrite={false}
				/> */}
				<Billboard position={[0.4, 0, 0]}>
					<group ref={labelZNegative} visible={false}>
						<Text font='/fonts/Inter-Bold.woff' color={'white'} fontSize={0.14}>
							-Z
						</Text>
					</group>
					<Circle
						scale={0.1}
						onPointerEnter={(event) => {
							event.stopPropagation()
							if (labelZNegative.current) labelZNegative.current.visible = true
						}}
						onPointerLeave={() => {
							if (labelZNegative.current) labelZNegative.current.visible = false
						}}
					>
						<meshBasicMaterial color={'#317acd'} />
					</Circle>
					<Circle scale={0.09}>
						<meshBasicMaterial color={'#292929'} />
					</Circle>
				</Billboard>
			</group>
		</Default3dScene>
	)
}
