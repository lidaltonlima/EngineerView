import './assets/main.scss'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { StructureProvider } from './contexts/Structure'
import { SceneProvider } from './contexts/Scene'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<SceneProvider>
			<StructureProvider>
				<App />
			</StructureProvider>
		</SceneProvider>
	</StrictMode>
)
