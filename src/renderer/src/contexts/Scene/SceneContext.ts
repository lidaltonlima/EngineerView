import { SceneViewOptions } from '@renderer/types/Scene'
import { createContext, useContext } from 'react'

export interface SceneContextData {
	view: SceneViewOptions
}

export const SceneContext = createContext({} as SceneContextData)

export const useSceneContext = (): SceneContextData => {
	return useContext(SceneContext)
}
