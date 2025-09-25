import { ThreeEvent } from '@react-three/fiber'

export const click = (event: ThreeEvent<MouseEvent>, useData: object): void => {
	event.stopPropagation()
	console.log(useData)
}
