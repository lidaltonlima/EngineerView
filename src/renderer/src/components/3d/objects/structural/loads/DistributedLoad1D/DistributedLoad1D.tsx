/**
 * Distributed Load in bars
 */
import { forcesType } from '@renderer/types/Structure'
import React from 'react'
import { LoadLocalSystem } from './LoadLocalSystem'
import { LoadGlobalSystem } from './LoadGlobalSystem'
import { Vector3 } from 'three'

interface IDistributedLoad1DCustomProps {
	name: string
	forceDirection: forcesType
	loads: [number, number]
	xPositions: [number, number]
	system: 'local' | 'global'
	barPoints: [Vector3, Vector3]

	size?: number

	positiveArrowColor?: string
	negativeArrowColor?: string
	labelColor?: string
}

type IDistributedLoad1DProps = IDistributedLoad1DCustomProps & React.JSX.IntrinsicElements['group']

export const DistributedLoad1D = ({
	name,
	forceDirection,
	loads,
	xPositions,
	system,
	size = 1,
	positiveArrowColor = 'cyan',
	negativeArrowColor = 'magenta',
	labelColor = 'white',
	barPoints,
	...props
}: IDistributedLoad1DProps): React.JSX.Element => {
	if (loads[0] === 0 && loads[1] === 0) return <></>

	return (
		<group {...props}>
			{system === 'local' ? (
				<LoadLocalSystem
					name={name}
					forceDirection={forceDirection}
					loads={loads}
					xPositions={xPositions}
					barPoints={[new Vector3(0, 0, 0), new Vector3(1, 0, 0)]}
					size={size}
					positiveArrowColor={positiveArrowColor}
					negativeArrowColor={negativeArrowColor}
					labelColor={labelColor}
				/>
			) : (
				<LoadGlobalSystem
					name={name}
					forceDirection={forceDirection}
					loads={loads}
					xPositions={xPositions}
					size={size}
					positiveArrowColor={positiveArrowColor}
					negativeArrowColor={negativeArrowColor}
					labelColor={labelColor}
					barPoints={barPoints}
				/>
			)}
		</group>
	)
}
