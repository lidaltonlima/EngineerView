export interface IBarData {
	name: string
	start_node: string
	end_node: string
	section: string
	material: string
	rotation: number
	start_connection: 'Fixed' | 'Hinged' | 'spring'
	end_connection: 'Fixed' | 'Hinged' | 'spring'
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
