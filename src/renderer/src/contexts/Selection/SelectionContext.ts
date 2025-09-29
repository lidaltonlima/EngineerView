import { selectionType } from '@renderer/types/Select'
import { createContext, useContext } from 'react'

export interface ISelectionContextData {
	selection: selectionType
}

export const SelectionContext = createContext({} as ISelectionContextData)

export const useSelectionContext = (): ISelectionContextData => {
	return useContext(SelectionContext)
}
