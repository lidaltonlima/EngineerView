import { Default3dScene } from './components/3d'

function App(): React.JSX.Element {
  window.electron.ipcRenderer.on('open-file', (_event, filePath) => {
    console.log(filePath)
  })

  return <Default3dScene />
}

export default App
