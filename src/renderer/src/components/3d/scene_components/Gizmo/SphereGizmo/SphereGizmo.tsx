import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { Line2, LineSegments2 } from 'three/examples/jsm/Addons'
import { ISphereGizmoProps } from './ISphereGizmoProps'
import { PositiveAxis } from './PositiveAxis'
import { NegativeAxis } from './NegativeAxis'

export const SphereGizmo = ({
	camera,
	onClickX = undefined,
	onClickLookingX = undefined,
	onClickXNegative = undefined,
	onClickLookingXNegative = undefined,

	onClickY = undefined,
	onClickLookingY = undefined,
	onClickYNegative = undefined,
	onClickLookingYNegative = undefined,

	onClickZ = undefined,
	onClickLookingZ = undefined,
	onClickZNegative = undefined,
	onClickLookingZNegative = undefined
}: ISphereGizmoProps): React.JSX.Element => {
	const labelX = useRef<THREE.MeshBasicMaterial>(null)
	const labelY = useRef<THREE.MeshBasicMaterial>(null)
	const labelZ = useRef<THREE.MeshBasicMaterial>(null)
	const labelXNegative = useRef<THREE.Group>(null)
	const labelYNegative = useRef<THREE.Group>(null)
	const labelZNegative = useRef<THREE.Group>(null)
	const lineXNegative = useRef<Line2 | LineSegments2>(null)
	const lineYNegative = useRef<Line2 | LineSegments2>(null)
	const lineZNegative = useRef<Line2 | LineSegments2>(null)

	const isMouseEnter = useRef(false)
	const cameraLooking = useRef<'x' | 'y' | 'z' | '-x' | '-y' | '-z' | 'none'>('none')

	useFrame(() => {
		if (camera.rotation.z === 0 && camera.rotation.y === Math.PI / 2) {
			cameraLooking.current = 'x'
		} else if (Math.abs(camera.rotation.z) === Math.PI && Math.abs(camera.rotation.y) < 0.001) {
			cameraLooking.current = 'y'
		} else if (Math.abs(camera.rotation.x) < 0.001 && Math.abs(camera.rotation.y) === 0) {
			cameraLooking.current = 'z'
		} else if (camera.rotation.z === 0 && camera.rotation.y === -Math.PI / 2) {
			cameraLooking.current = '-x'
		} else if (camera.rotation.z === 0 && camera.rotation.y === 0) {
			cameraLooking.current = '-y'
		} else if (
			Math.abs(camera.rotation.x) > Math.PI - 0.001 &&
			Math.abs(camera.rotation.y) === 0
		) {
			cameraLooking.current = '-z'
		} else {
			cameraLooking.current = 'none'
		}

		if (cameraLooking.current !== 'none') {
			if (labelXNegative.current) labelXNegative.current.visible = true
			if (lineXNegative.current) lineXNegative.current.visible = true

			if (labelYNegative.current) labelYNegative.current.visible = true
			if (lineYNegative.current) lineYNegative.current.visible = true

			if (labelZNegative.current) labelZNegative.current.visible = true
			if (lineZNegative.current) lineZNegative.current.visible = true
		} else if (!isMouseEnter.current) {
			if (labelXNegative.current) labelXNegative.current.visible = false
			if (lineXNegative.current) lineXNegative.current.visible = false

			if (labelYNegative.current) labelYNegative.current.visible = false
			if (lineYNegative.current) lineYNegative.current.visible = false

			if (labelZNegative.current) labelZNegative.current.visible = false
			if (lineZNegative.current) lineZNegative.current.visible = false
		}
	}, 1)

	return (
		<>
			<PositiveAxis
				axis='x'
				label='X'
				labelRef={labelX}
				cameraLooking={cameraLooking}
				color='#ff3653'
				rotation={[0, 0, 0]}
				onClick={onClickX}
				onClickLooking={onClickLookingX}
			/>
			<PositiveAxis
				axis='y'
				label='Y'
				labelRef={labelY}
				cameraLooking={cameraLooking}
				color='#77b316'
				rotation={[0, 0, Math.PI * 0.5]}
				onClick={onClickY}
				onClickLooking={onClickLookingY}
			/>
			<PositiveAxis
				axis='z'
				label='Z'
				labelRef={labelZ}
				cameraLooking={cameraLooking}
				color='#317acd'
				rotation={[0, -Math.PI * 0.5, 0]}
				onClick={onClickZ}
				onClickLooking={onClickLookingZ}
			/>
			<NegativeAxis
				axis='-x'
				label='-X'
				labelRef={labelXNegative}
				lineRef={lineXNegative}
				cameraLooking={cameraLooking}
				isMouseEnter={isMouseEnter}
				color='#ff3653'
				rotation={[0, 0, Math.PI]}
				onClick={onClickXNegative}
				onClickLooking={onClickLookingXNegative}
			/>
			<NegativeAxis
				axis='-y'
				label='-Y'
				labelRef={labelYNegative}
				lineRef={lineYNegative}
				cameraLooking={cameraLooking}
				isMouseEnter={isMouseEnter}
				color='#77b316'
				rotation={[0, 0, -Math.PI / 2]}
				onClick={onClickYNegative}
				onClickLooking={onClickLookingYNegative}
			/>
			<NegativeAxis
				axis='-z'
				label='-Z'
				labelRef={labelZNegative}
				lineRef={lineZNegative}
				cameraLooking={cameraLooking}
				isMouseEnter={isMouseEnter}
				color='#317acd'
				rotation={[0, Math.PI / 2, 0]}
				onClick={onClickZNegative}
				onClickLooking={onClickLookingZNegative}
			/>
			{/* <group>
				<Line fog points={[0, 0, 0, 0.3, 0, 0]} color={'#ff3653'} lineWidth={2} />
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
							if (onClickLookingX && cameraLooking.current === 'x') onClickLookingX()
							else if (onClickX) onClickX()
						}}
					>
						<meshBasicMaterial color={'#ff3653'} />
					</Circle>
				</Billboard>
			</group> */}
			{/* <group rotation-z={Math.PI * 0.5}>
				<Line fog points={[0, 0, 0, 0.3, 0, 0]} color={'#77b316'} lineWidth={2} />
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
							if (onClickLookingY && cameraLooking.current === 'y') onClickLookingY()
							else if (onClickY) onClickY()
						}}
					>
						<meshBasicMaterial color={'#77b316'} />
					</Circle>
				</Billboard>
			</group> */}
			{/* <group rotation-y={-Math.PI * 0.5}>
				<Line fog points={[0, 0, 0, 0.3, 0, 0]} color={'#317acd'} lineWidth={2} />
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
							if (onClickLookingZ && cameraLooking.current === 'z') onClickLookingZ()
							else if (onClickZ) onClickZ()
						}}
					>
						<meshBasicMaterial color={'#317acd'} />
					</Circle>
				</Billboard>
			</group> */}
			{/* <group rotation-z={Math.PI}>
				<Line
					ref={lineXNegative}
					points={[0, 0, 0, 0.3, 0, 0]}
					color={'#ff3653'}
					lineWidth={2}
					depthTest={false}
					depthWrite={false}
				/>
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
							isMouseEnter.current = true
						}}
						onPointerLeave={() => {
							if (labelXNegative.current) labelXNegative.current.visible = false
							isMouseEnter.current = false
						}}
						onClick={(event) => {
							event.stopPropagation()
							if (onClickLookingXNegative && cameraLooking.current === '-x')
								onClickLookingXNegative()
							else if (onClickXNegative) onClickXNegative()
						}}
					>
						<meshBasicMaterial color={'#ff3653'} />
					</Circle>
					<Circle scale={0.09} position={[0, 0, 0.005]}>
						<meshBasicMaterial color={'black'} transparent opacity={0.7} />
					</Circle>
				</Billboard>
			</group> */}
			{/* <group rotation-z={-Math.PI / 2}>
				<Line
					ref={lineYNegative}
					points={[0, 0, 0, 0.3, 0, 0]}
					color={'#77b316'}
					lineWidth={2}
					depthTest={false}
					depthWrite={false}
				/>
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
							isMouseEnter.current = true
						}}
						onPointerLeave={() => {
							if (labelYNegative.current) labelYNegative.current.visible = false
							isMouseEnter.current = false
						}}
						onClick={(event) => {
							event.stopPropagation()
							if (onClickLookingYNegative && cameraLooking.current === '-y')
								onClickLookingYNegative()
							else if (onClickYNegative) onClickYNegative()
						}}
					>
						<meshBasicMaterial color={'#77b316'} />
					</Circle>
					<Circle scale={0.09} position={[0, 0, 0.005]}>
						<meshBasicMaterial color={'black'} transparent opacity={0.7} />
					</Circle>
				</Billboard>
			</group> */}
			{/* <group rotation-y={Math.PI / 2}>
				<Line
					ref={lineZNegative}
					points={[0, 0, 0, 0.3, 0, 0]}
					color={'#317acd'}
					lineWidth={2}
					depthTest={false}
					depthWrite={false}
				/>
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
							isMouseEnter.current = true
						}}
						onPointerLeave={() => {
							if (labelZNegative.current) labelZNegative.current.visible = false
							isMouseEnter.current = false
						}}
						onClick={(event) => {
							event.stopPropagation()
							if (onClickLookingZNegative && cameraLooking.current === '-z')
								onClickLookingZNegative()
							else if (onClickZNegative) onClickZNegative()
						}}
					>
						<meshBasicMaterial color={'#317acd'} />
					</Circle>
					<Circle scale={0.09} position={[0, 0, 0.005]}>
						<meshBasicMaterial color={'black'} transparent opacity={0.7} />
					</Circle>
				</Billboard>
			</group> */}
		</>
	)
}
