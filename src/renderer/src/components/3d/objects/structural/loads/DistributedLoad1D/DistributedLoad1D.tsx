/**
 * Distributed Load in bars
 */
import { forcesType } from '@renderer/types/Structure'
import React from 'react'
import { LoadLocalSystem } from './LoadLocalSystem'
import { LoadGlobalSystem } from './LoadGlobalSystem'
import * as THREE from 'three'

interface IDistributedLoad1DCustomProps {
	name: string
	forceDirection: forcesType
	loads: [number, number]
	xPositions: [number, number]
	system: 'local' | 'global'
	barPoints: [THREE.Vector3, THREE.Vector3]

	height?: number

	positiveArrowColor?: string
	negativeArrowColor?: string
	textColor?: string
}

type IDistributedLoad1DProps = IDistributedLoad1DCustomProps & React.JSX.IntrinsicElements['group']

export const DistributedLoad1D = ({
	name,
	forceDirection,
	loads,
	xPositions,
	system,
	height = 1,
	positiveArrowColor = 'cyan',
	negativeArrowColor = 'magenta',
	textColor = 'white',
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
					height={height}
					positiveArrowColor={positiveArrowColor}
					negativeArrowColor={negativeArrowColor}
					textColor={textColor}
				/>
			) : (
				<LoadGlobalSystem
					name={name}
					forceDirection={forceDirection}
					loads={loads}
					xPositions={xPositions}
					size={height}
					positiveArrowColor={positiveArrowColor}
					negativeArrowColor={negativeArrowColor}
					textColor={textColor}
					barPoints={barPoints}
				/>
			)}
		</group>
	)
}
