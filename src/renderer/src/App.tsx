import { useEffect, useState } from 'react'
import { Default3dScene } from './components/3d'
import { Bar } from './components/3d/objects/Bar'

export const App = (): React.JSX.Element => {
	const [bars, setBars] = useState<number[]>([])

	useEffect(() => {
		const disposeOpenFile = window.electron.ipcRenderer.on('open-file', (_event, data) => {
			setBars(data.bars)
		})

		return () => {
			disposeOpenFile()
		}
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
			{bars.map((bar, index) => (
				<Bar
					key={bar}
					name='B1'
					color='blue'
					startNode={[0, 0, 0]}
					endNode={[2 * index, 0.5 * index, 0.5]}
				/>
			))}
		</Default3dScene>
	)
}
