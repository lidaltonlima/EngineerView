import { Billboard, Circle, Hud, Line, OrthographicCamera, Text } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

export const Gizmo = (): React.JSX.Element => {
	const { size, camera } = useThree()
	const mesh = useRef<THREE.Group>(new THREE.Group())

	// Calcula a posição com base no tamanho atual
	const position = useMemo(() => {
		const zoom = 90 // mesmo zoom da câmera ortográfica
		const position = new THREE.Vector3()
		position.set(
			size.width / (2 * zoom) - 1, // canto direito
			size.height / (2 * zoom) - 1, // canto superior
			0
		)

		return position
	}, [size])

	useFrame(() => {
		// Spin mesh to the inverse of the default cameras matrix
		const matrix = new THREE.Matrix4()
		matrix.copy(camera.matrix).invert()
		mesh.current.quaternion.setFromRotationMatrix(matrix)
	})

	return (
		<Hud>
			{/* Câmera do gizmo */}
			<OrthographicCamera makeDefault position={[0, 0, 10]} zoom={90} />
			<ambientLight intensity={1} />
			<group ref={mesh} position={position}>
				<GizmoSphere />
			</group>
		</Hud>
	)
}

function GizmoSphere(): React.JSX.Element {
	const labelXNegative = useRef<THREE.Group>(null)
	const labelYNegative = useRef<THREE.Group>(null)
	const labelZNegative = useRef<THREE.Group>(null)

	return (
		<>
			<group>
				<Line points={[0, 0, 0, 0.31, 0, 0]} color={'#ff3653'} lineWidth={2} />
				<Billboard position={[0.4, 0, 0]}>
					<Text font='/fonts/Inter-Bold.woff' color={'black'} fontSize={0.12}>
						X
					</Text>
					<Circle scale={0.1}>
						<meshBasicMaterial color={'#ff3653'} />
					</Circle>
				</Billboard>
			</group>
			<group rotation-z={Math.PI * 0.5}>
				<Line points={[0, 0, 0, 0.31, 0, 0]} color={'#77b316'} lineWidth={2} />
				<Billboard position={[0.4, 0, 0]}>
					<Text font='/fonts/Inter-Bold.woff' color={'black'} fontSize={0.12}>
						Y
					</Text>
					<Circle scale={0.1}>
						<meshBasicMaterial color={'#77b316'} />
					</Circle>
				</Billboard>
			</group>
			<group rotation-y={-Math.PI * 0.5}>
				<Line points={[0, 0, 0, 0.31, 0, 0]} color={'#317acd'} lineWidth={2} />
				<Billboard position={[0.4, 0, 0]}>
					<Text font='/fonts/Inter-Bold.woff' color={'black'} fontSize={0.12}>
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
						<Text font='/fonts/Inter-Bold.woff' color={'white'} fontSize={0.12}>
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
						<Text font='/fonts/Inter-Bold.woff' color={'white'} fontSize={0.12}>
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
						<Text font='/fonts/Inter-Bold.woff' color={'white'} fontSize={0.12}>
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
		</>
	)
}
