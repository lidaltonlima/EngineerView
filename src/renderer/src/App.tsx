import { useEffect } from 'react'
import { Default3dScene } from './components/3d'
// import { Point, Points } from '@react-three/drei'
import { DrawLine } from './components/3d/objects'

export const App = (): React.JSX.Element => {
  useEffect(() => {
    window.electron.ipcRenderer.on('open-file', (_event, filePath) => {
      console.log(filePath)
    })
  }, [])

  return (
    <Default3dScene>
      {/* <Points limit={2} range={2}>
        <pointsMaterial vertexColors size={0.1} />
        <Point
          name='pt_01'
          position={[1, 1, 1]}
          color={'red'}
          onClick={(event) => console.log(event.object.name)}
        />
      </Points> */}
      <DrawLine />
    </Default3dScene>
  )
}
