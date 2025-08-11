import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { StructureProvider } from './contexts/Structure'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<StructureProvider>
			<App />
		</StructureProvider>
	</StrictMode>
)
