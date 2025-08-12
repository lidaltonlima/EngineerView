export interface IBarData {
	name: string
	startNode: string
	endNode: string
	section: string
	material: string
	rotation: number
	startConnection: 'Fixed' | 'Hinged' | 'spring'
	endConnection: 'Fixed' | 'Hinged' | 'spring'
}

export interface INodeData {
	name: string
	position: number[]
	type: 'Fixed' | 'Hinged' | 'spring' | 'blend'
}

export interface IStructureData {
	nodes: INodeData[]
	bars: IBarData[]
}
