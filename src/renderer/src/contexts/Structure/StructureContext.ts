import { IBars, INodes } from '@renderer/types/Structure'
import { createContext, useContext } from 'react'

export interface StructureContextData {
	bars: IBars[]
	nodes: INodes[]
}

export const StructureContext = createContext({} as StructureContextData)

export const useStructureContext = (): StructureContextData => {
	return useContext(StructureContext)
}
