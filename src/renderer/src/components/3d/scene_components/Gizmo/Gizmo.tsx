import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { ViewportGizmo } from 'three-viewport-gizmo'

export const Gizmo = (): React.JSX.Element => {
  const { camera, gl, scene, controls } = useThree()
  const gizmoRef = useRef<ViewportGizmo>(null)

  useEffect(() => {
    const gizmo = new ViewportGizmo(camera, gl)
    gizmoRef.current = gizmo

    const resize = (): void => {
      const width = window.innerWidth
      const height = window.innerHeight - 1
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      gl.setSize(width, height)
      gizmo.update()
    }

    if (controls) {
      gizmo.addEventListener('start', () => (controls.enabled = false))
      gizmo.addEventListener('end', () => (controls.enabled = true))
      gizmo.addEventListener('change', () => {
        controls.setPosition(...camera.position.toArray())
      })
      controls.addEventListener('update', () => {
        controls.getTarget(gizmo.target)
        gizmo.update()
      })
    }

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [camera, gl, scene, controls])

  useFrame(() => {
    if (gizmoRef.current) {
      gl.render(scene, camera)
      gizmoRef.current.render()
    }
  }, true)

  return <></>
}
