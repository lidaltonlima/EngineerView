// import { useThree } from '@react-three/fiber'
// import * as THREE from 'three'

import { Line } from '@react-three/drei'

export const DrawLine = (): React.JSX.Element => {
  // const { scene } = useThree()

  // const material = new THREE.LineBasicMaterial({ color: 0x0000ff })
  // const points: THREE.Vector3[] = []
  // points.push(new THREE.Vector3(0, 0, 0))
  // points.push(new THREE.Vector3(1, 1, 2))

  // const geometry = new THREE.BufferGeometry().setFromPoints(points)

  // const line = new THREE.Line(geometry, material)
  // scene.add(line)

  return (
    <>
      <Line
        name='B1'
        points={[
          [0, 0, 0],
          [1, 1, 1]
        ]}
        color={'red'}
        lineWidth={0.03}
        worldUnits
        onClick={(event) => {
          console.log(event.object.name)
          event.stopPropagation()
        }}
      />
      <Line
        name='B2'
        points={[
          [0, 0, 0],
          [2, 1, 1]
        ]}
        color={'blue'}
        lineWidth={0.03}
        worldUnits
        onClick={(event) => {
          console.log(event.object.name)
          event.stopPropagation()
        }}
      />
    </>
  )
}
