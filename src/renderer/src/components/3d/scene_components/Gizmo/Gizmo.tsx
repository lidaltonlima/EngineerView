import {
	Billboard,
	CameraControls,
	Circle,
	Hud,
	Line,
	OrthographicCamera,
	Text
} from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

export const Gizmo = (): React.JSX.Element => {
	const { size, camera, controls } = useThree()
	const cameraControls = controls as CameraControls

	const mesh = useRef<THREE.Group>(new THREE.Group())

	const moveToUp = (): void => {
		cameraControls.rotateTo(0, 0, true)
	}

	const moveToDown = (): void => {
		cameraControls.rotateTo(0, Math.PI, true)
	}

	const moveToRight = (): void => {
		cameraControls.rotateTo(Math.PI / 2, Math.PI / 2, true)
	}

	const moveToLeft = (): void => {
		cameraControls.rotateTo(-Math.PI / 2, Math.PI / 2, true)
	}

	const moveToFront = (): void => {
		cameraControls.rotateTo(0, Math.PI / 2, true)
	}

	const moveToBack = (): void => {
		cameraControls.rotateTo(Math.PI, Math.PI / 2, true)
	}

	// Calcula a posição com base no tamanho atual
	const position = useMemo(() => {
		const zoom = 90 // mesmo zoom da câmera ortográfica
		const position = new THREE.Vector3()
		position.set(
			size.width / (2 * zoom) - 0.6, // canto direito
			size.height / (2 * zoom) - 0.6, // canto superior
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
			<OrthographicCamera makeDefault position={[0, 0, 0.6]} zoom={90} />
			<ambientLight intensity={1} />
			<fog attach='fog' args={['#1a1a1a', 0.5, 1.5]} />
			<group ref={mesh} position={position}>
				<GizmoSphere
					onClickX={moveToRight}
					onClickXNegative={moveToLeft}
					onClickY={moveToBack}
					onClickYNegative={moveToFront}
					onClickZ={moveToUp}
					onClickZNegative={moveToDown}
				/>
			</group>
		</Hud>
	)
}

interface IGizmoSphereProps {
	onClickX?: () => void
	onClickY?: () => void
	onClickZ?: () => void
	onClickXNegative?: () => void
	onClickYNegative?: () => void
	onClickZNegative?: () => void
}

function GizmoSphere({
	onClickX = undefined,
	onClickY = undefined,
	onClickZ = undefined,
	onClickXNegative = undefined,
	onClickYNegative = undefined,
	onClickZNegative = undefined
}: IGizmoSphereProps): React.JSX.Element {
	const labelX = useRef<THREE.MeshBasicMaterial>(null)
	const labelY = useRef<THREE.MeshBasicMaterial>(null)
	const labelZ = useRef<THREE.MeshBasicMaterial>(null)
	const labelXNegative = useRef<THREE.Group>(null)
	const labelYNegative = useRef<THREE.Group>(null)
	const labelZNegative = useRef<THREE.Group>(null)

	return (
		<>
			<group>
				<Line fog points={[0, 0, 0, 0.31, 0, 0]} color={'#ff3653'} lineWidth={2} />
				<Billboard position={[0.4, 0, 0]}>
					<Text position={[0, 0, 0.01]} font='/fonts/Inter-Bold.woff' fontSize={0.14}>
						X
						<meshBasicMaterial ref={labelX} color={'black'} fog={false} />
					</Text>
					<Circle
						scale={0.1}
						onPointerEnter={(event) => {
							event.stopPropagation()
							labelX.current?.color.set('white')
						}}
						onPointerLeave={() => {
							labelX.current?.color.set('black')
						}}
						onClick={(event) => {
							event.stopPropagation()
							if (onClickX) onClickX()
						}}
					>
						<meshBasicMaterial color={'#ff3653'} />
					</Circle>
				</Billboard>
			</group>
			<group rotation-z={Math.PI * 0.5}>
				<Line fog points={[0, 0, 0, 0.31, 0, 0]} color={'#77b316'} lineWidth={2} />
				<Billboard position={[0.4, 0, 0]}>
					<Text position={[0, 0, 0.01]} font='/fonts/Inter-Bold.woff' fontSize={0.14}>
						Y
						<meshBasicMaterial ref={labelY} color={'black'} fog={false} />
					</Text>
					<Circle
						scale={0.1}
						onPointerEnter={(event) => {
							event.stopPropagation()
							labelY.current?.color.set('white')
						}}
						onPointerLeave={() => {
							labelY.current?.color.set('black')
						}}
						onClick={(event) => {
							event.stopPropagation()
							if (onClickY) onClickY()
						}}
					>
						<meshBasicMaterial color={'#77b316'} />
					</Circle>
				</Billboard>
			</group>
			<group rotation-y={-Math.PI * 0.5}>
				<Line fog points={[0, 0, 0, 0.31, 0, 0]} color={'#317acd'} lineWidth={2} />
				<Billboard position={[0.4, 0, 0]}>
					<Text position={[0, 0, 0.01]} font='/fonts/Inter-Bold.woff' fontSize={0.14}>
						Z
						<meshBasicMaterial ref={labelZ} color={'black'} fog={false} />
					</Text>
					<Circle
						scale={0.1}
						onPointerEnter={(event) => {
							event.stopPropagation()
							labelZ.current?.color.set('white')
						}}
						onPointerLeave={() => {
							labelZ.current?.color.set('black')
						}}
						onClick={(event) => {
							event.stopPropagation()
							if (onClickZ) onClickZ()
						}}
					>
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
					<group ref={labelXNegative} visible={false} position={[0, 0, 0.01]}>
						<Text font='/fonts/Inter-Bold.woff' fontSize={0.14}>
							-X
							<meshBasicMaterial color={'white'} fog={false} />
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
						onClick={(event) => {
							event.stopPropagation()
							if (onClickXNegative) onClickXNegative()
						}}
					>
						<meshBasicMaterial color={'#ff3653'} />
					</Circle>
					<Circle scale={0.09} position={[0, 0, 0.005]}>
						<meshBasicMaterial color={'black'} transparent opacity={0.7} />
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
					<group ref={labelYNegative} visible={false} position={[0, 0, 0.01]}>
						<Text font='/fonts/Inter-Bold.woff' color={'white'} fontSize={0.14}>
							-Y
							<meshBasicMaterial color={'white'} fog={false} />
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
						onClick={(event) => {
							event.stopPropagation()
							if (onClickYNegative) onClickYNegative()
						}}
					>
						<meshBasicMaterial color={'#77b316'} />
					</Circle>
					<Circle scale={0.09} position={[0, 0, 0.005]}>
						<meshBasicMaterial color={'black'} transparent opacity={0.7} />
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
					<group ref={labelZNegative} visible={false} position={[0, 0, 0.01]}>
						<Text font='/fonts/Inter-Bold.woff' color={'white'} fontSize={0.14}>
							-Z
							<meshBasicMaterial color={'white'} fog={false} />
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
						onClick={(event) => {
							event.stopPropagation()
							if (onClickZNegative) onClickZNegative()
						}}
					>
						<meshBasicMaterial color={'#317acd'} />
					</Circle>
					<Circle scale={0.09} position={[0, 0, 0.005]}>
						<meshBasicMaterial color={'black'} transparent opacity={0.7} />
					</Circle>
				</Billboard>
			</group>
		</>
	)
}
