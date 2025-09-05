import { Force } from './Force'
import { Moment } from './Moment'

interface INodalLoadCustomProps {
	fx?: number
	fy?: number
	fz?: number
	mx?: number
	my?: number
	mz?: number

	label?: boolean
}

type INodalLoadProps = INodalLoadCustomProps & React.JSX.IntrinsicElements['group']

export const PointLoad = ({
	fx = 0,
	fy = 0,
	fz = 0,
	mx = 0,
	my = 0,
	mz = 0,
	label = false,
	...props
}: INodalLoadProps): React.JSX.Element => {
	return (
		<group {...props}>
			{/* Positive values */}
			{fx > 0 && <Force direction='x' value={fx} label={label} arrowColor='red' />}
			{fy > 0 && <Force direction='y' value={fy} label={label} arrowColor='green' />}
			{fz > 0 && <Force direction='z' value={fz} label={label} arrowColor='blue' />}
			{mx > 0 && <Moment direction='x' value={mx} label={label} arrowColor='red' />}
			{my > 0 && <Moment direction='y' value={my} label={label} arrowColor='green' />}
			{mz > 0 && <Moment direction='z' value={mz} label={label} arrowColor='blue' />}
			{/* Negative values */}
			{fx < 0 && <Force direction='-x' value={fx} label={label} arrowColor='#ff6666' />}
			{fy < 0 && <Force direction='-y' value={fy} label={label} arrowColor='#00e600' />}
			{fz < 0 && <Force direction='-z' value={fz} label={label} arrowColor='#6666ff' />}
			{mx < 0 && <Moment direction='-x' value={mx} label={label} arrowColor='#ff6666' />}
			{my < 0 && <Moment direction='-y' value={my} label={label} arrowColor='#00e600' />}
			{mz < 0 && <Moment direction='-z' value={mz} label={label} arrowColor='#6666ff' />}
			{/* Labels */}
		</group>
	)
}
