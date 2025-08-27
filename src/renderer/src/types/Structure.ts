/**
 * Interface for structure data
 */
export interface IStructureData {
	materials: IMaterialData[]
	sections: ISectionData[]
	nodes: INodeData[]
	bars: IBarData[]
	supports: ISupportData[]
	loads: ILoadData[]
}

// Material and Section ///////////////////////////////////////////////////////////////////////////
export interface IMaterialData {
	name: string
	properties: { E: number; G: number; ni: number; rho: number }
}

export interface ISectionData {
	name: string
	area: number
	inertias: { Ix: number; Iy: number; Iz: number }
}

// Nodes //////////////////////////////////////////////////////////////////////////////////////////
export interface INodeData {
	name: string
	position: [number, number, number]
	type: 'Fixed' | 'Hinged' | 'spring' | 'blend'
}

// bars ///////////////////////////////////////////////////////////////////////////////////////////
export interface IBarData {
	name: string
	start_node: string
	end_node: string
	section: string
	material: string
	rotate_releases: boolean
	rotation: number
	releases: IReleasesData[]
}

// Releases ***************************************************************************************
export type IReleasesData =
	| 'Dxi'
	| 'Dyi'
	| 'Dzi'
	| 'Rxi'
	| 'Ryi'
	| 'Rzi'
	| 'Dxj'
	| 'Dyj'
	| 'Dzj'
	| 'Rxj'
	| 'Ryj'
	| 'Rzj'

// Supports ///////////////////////////////////////////////////////////////////////////////////////
export interface ISupportData {
	node: string
	supports: {
		Dx: number | boolean
		Dy: number | boolean
		Dz: number | boolean
		Rx: number | boolean
		Ry: number | boolean
		Rz: number | boolean
	}
}

// Loads //////////////////////////////////////////////////////////////////////////////////////////
interface ILoadData {
	name: string
	nodes_loads: IPointLoadsData[]
	bars_loads: IBarLoadsData[]
}

// Nodal loads ************************************************************************************
interface IPointLoadsData {
	node: string
	loads: { Fx: number; Fy: number; Fz: number; Mx: number; My: number; Mz: number }
}

// Bar loads **************************************************************************************
interface IBarLoadsData {
	points: IBarPointLoadsData[]
	distributed: IBarDistributedLoadsData[]
}

interface IBarPointLoadsData {
	bar: string
	position: [number, number, number]
	reference: 'local' | 'global'
	loads: { Fx: number; Fy: number; Fz: number; Mx: number; My: number; Mz: number }
}

interface IBarDistributedLoadsData {
	bar: string
	reference: 'local' | 'global'
	loads: { Fx: number; Fy: number; Fz: number; Mx: number; My: number; Mz: number }
}
