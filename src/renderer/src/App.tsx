import { useEffect, useState } from 'react'
import { Default3dScene } from './components/3d'
import { Bar, DrawSupport, Node } from './components/3d/objects/structural/elements'
import { useStructureContext } from './contexts/Structure'
import { IStructureData } from './types/Structure'
import { ResizableContainer } from './containers'
import { Accordion } from './containers/Accordion'
import { ViewEntities } from './contents'
import { useSceneContext } from './contexts/Scene'

export const App = (): React.JSX.Element => {
	const { structure } = useStructureContext()
	const { view } = useSceneContext()

	const [structureData, setStructureData] = useState<IStructureData | null>()

	const [viewSupports] = view.supports

	useEffect(() => {
		const disposeOpenFile = window.electron.ipcRenderer.on(
			'open-file',
			(_event, data: IStructureData) => {
				setStructureData(data)
				structure.nodes = data.nodes
				structure.bars = data.bars
				structure.supports = data.supports
				structure.loads = data.loads
				structure.materials = data.materials
				structure.sections = data.sections
				structure.results = data.results
			}
		)

		return () => {
			disposeOpenFile()
		}
	}, [structure])

	return (
		<>
			<main>
				<div className='canvas-container'>
					<div className='canvas-content'>
						<Default3dScene>
							{structureData?.bars.map((bar) => <Bar key={bar.name} bar={bar} />)}
							{structureData?.nodes.map((node) => <Node key={node.name} node={node} />)}
							{viewSupports &&
								structureData?.supports.map((support) => DrawSupport(support, structure))}
							<axesHelper />
						</Default3dScene>
					</div>
				</div>
				<ResizableContainer
					className='aside'
					initialWidth={250}
					minWidth={250}
					maxWidth={500}
					resizeLeft
					fullHeight
				>
					<Accordion title='View' className='accordion'>
						<ViewEntities />
					</Accordion>
				</ResizableContainer>
			</main>
			<footer>Footer</footer>
		</>
	)
}
