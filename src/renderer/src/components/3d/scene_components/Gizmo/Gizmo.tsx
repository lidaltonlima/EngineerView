import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { ViewportGizmo } from 'three-viewport-gizmo'
import { CameraControls } from '@react-three/drei'

export const Gizmo = (): React.JSX.Element => {
  const gizmoRef = useRef<ViewportGizmo>(null)

  const { camera, gl, scene, controls } = useThree()
  const cameraControls = controls as CameraControls

  useEffect(() => {
    const gizmo = new ViewportGizmo(camera, gl)
    gizmoRef.current = gizmo

    const resize = (): void => {
      gizmo.update()
    }

    if (cameraControls) {
      gizmo.addEventListener('start', () => (cameraControls.enabled = false))
      gizmo.addEventListener('end', () => (cameraControls.enabled = true))
      gizmo.addEventListener('change', () => {
        cameraControls.setPosition(...camera.position.toArray())
      })
      cameraControls.addEventListener('update', () => {
        cameraControls.getTarget(gizmo.target)
        gizmo.update()
      })
    }

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [camera, gl, scene, cameraControls])

  useFrame(() => {
    if (gizmoRef.current) {
      gl.render(scene, camera)
      gizmoRef.current.render()
    }
  }, 1)

  return <></>
}
