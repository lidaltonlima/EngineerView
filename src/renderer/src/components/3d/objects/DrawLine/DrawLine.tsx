import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

export const DrawLine = (): React.JSX.Element => {
  const { scene } = useThree()

  const material = new THREE.LineBasicMaterial({ color: 0x0000ff })
  const points: THREE.Vector3[] = []
  points.push(new THREE.Vector3(0, 0, 0))
  points.push(new THREE.Vector3(1, 1, 2))

  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  const line = new THREE.Line(geometry, material)
  scene.add(line)

  return <></>
}
