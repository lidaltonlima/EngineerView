import { Edges, PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { CameraControlsConfig, Gizmo, GridConfig, LightBase } from '../scene_components'

export const Default3dScene = (): React.JSX.Element => {
  THREE.Object3D.DEFAULT_UP.set(0, 0, 1)

  return (
    <>
      <Canvas>
        <CameraControlsConfig />
        <Gizmo />
        <GridConfig />
        <LightBase />
        <PerspectiveCamera makeDefault position={[5, -5, 5]}>
          {/* eslint-disable-next-line react/no-unknown-property */}
          <directionalLight intensity={2} color={0xffffff} />
        </PerspectiveCamera>
        <mesh>
          <boxGeometry />
          <meshLambertMaterial color={[1, 0, 0]} />
          <Edges threshold={15} color='black' />
        </mesh>
      </Canvas>
    </>
  )
}
