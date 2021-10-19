import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import { Article } from './A_article'

const gltfloader = new GLTFLoader()
const getnames = new THREE.FileLoader()
let infos = []
export function PointerInfo(scene) {
  getnames.setMimeType('json')
  getnames.load('/pointer.json', function (all) {
    const pointerData = JSON.parse(all)

    const nannotationDiv_ = document.createElement('div')
    nannotationDiv_.className = 'info'
    //surroundData.length;
    for (let i = 0; i < pointerData.length; i++) {
      const nannotationDiv = document.createElement('div')
      nannotationDiv_.appendChild(nannotationDiv)
      nannotationDiv.className = 'pointerName'
      nannotationDiv.innerHTML = pointerData[i].name
      const nannotationLabel = new CSS2DObject(nannotationDiv)

      nannotationLabel.position.copy(pointerData[i].position)
      //
      const material = new THREE.LineBasicMaterial({ color: 0x000000 })
      const points = []
      points.push(new THREE.Vector3(pointerData[i].position.x, pointerData[i].position.y, pointerData[i].position.z))
      points.push(new THREE.Vector3(pointerData[i].position.x, pointerData[i].position.y - 2, pointerData[i].position.z))
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(geometry, material)
      ///
      const map = new THREE.TextureLoader().load('./img/circle.png')
      const sp_material = new THREE.SpriteMaterial({ map: map, depthTest: false, sizeAttenuation: true, depthWrite: false })
      const sprite = new THREE.Sprite(sp_material)
      sprite.scale.set(0.66, 0.66, 1)
      sprite.position.copy(pointerData[i].position)

      infos.push(nannotationLabel)
      infos.push(line)
      infos.push(sprite)
      //console.log(nannotationDiv)
    }
    infos.forEach(function (inf) {
      scene.add(inf)
    })
  })
  return infos
}

export function Modelize(scene, resourceData, gltfs) {
  //console.log(gltfs)
  //console.log(resourceData)
  gltfloader.load(
    resourceData.path,
    function (gltf) {
      //console.log(gltf)
      const view = gltf.scene
      //view.userData = i
      //gltf.scene.scale.set(01, .01, .01)
      view.position.copy(resourceData.position)

      const nannotationDiv = document.createElement('div')
      nannotationDiv.className = 'modelName'
      nannotationDiv.innerHTML = resourceData.name

      const nannotationLabel = new CSS2DObject(nannotationDiv)
      nannotationLabel.position.copy(resourceData.position)
      nannotationLabel.position.y = resourceData.position.y + 5
      view.userData = nannotationLabel.id
      nannotationLabel.name = resourceData.name + '_'
      nannotationLabel.visible = false

      scene.add(nannotationLabel)

      view.traverse(function (node) {
        if (node.isMesh) {
          node.userData = view.id
          node.material.side = THREE.DoubleSide

          if (node.material.opacity === 1.0) {
            node.material.transparent = false
            node.material.opacity = 0.6
          }
        }
      })
      view.name = resourceData.name

      scene.add(view)

      gltfs.push(view)
    },

    undefined,
    function (error) {
      console.error(error)
    },
  )
}
