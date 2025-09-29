import { useThree } from '@react-three/fiber'
import { useCallback, useEffect } from 'react'
import * as THREE from 'three'

export const ClickVoid = (): React.JSX.Element => {
	const { camera, scene, gl } = useThree()

	const handleClick = useCallback(
		(event: MouseEvent) => {
			const raycaster = new THREE.Raycaster()
			const mouse = new THREE.Vector2()

			// normaliza coordenadas do clique
			mouse.x = (event.offsetX / gl.domElement.clientWidth) * 2 - 1
			mouse.y = -(event.offsetY / gl.domElement.clientHeight) * 2 + 1

			raycaster.setFromCamera(mouse, camera)
			const intersects = raycaster.intersectObjects(scene.children, true)

			let clickedInEntity = false
			if (intersects.length === 0) {
				clickedInEntity = false
			} else {
				for (const intersect of intersects) {
					if (intersect.object.name) {
						clickedInEntity = true
					}
				}
			}

			if (!clickedInEntity) {
				console.log('click in void')
			}
		},
		[camera, scene, gl]
	)

	// adiciona o listener no canvas
	useEffect(() => {
		const canvas = gl.domElement
		canvas.addEventListener('pointerdown', handleClick)

		return () => {
			canvas.removeEventListener('pointerdown', handleClick)
		}
	}, [handleClick, gl])

	return <></>
}
