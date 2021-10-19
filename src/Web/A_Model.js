import * as THREE from 'three'
import { ThreeMFLoader } from 'three-stdlib'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'

export function Amodel(scene, renderer, model) {
  //console.log(model.id)
  const newscene = new THREE.Scene()

  //newscene.background = null
  newscene.background = new THREE.Color(0xf1f1f1)

  var light = new THREE.DirectionalLight(0xffffff, 1)
  light.position.set(-10, 20, 10)
  //newscene.add(light)
  var light2 = new THREE.DirectionalLight(0x404040, 1.5)
  light2.position.set(10, 20, -10)
  newscene.add(light2)

  var light3 = new THREE.DirectionalLight(0x2a2e1a, 1)
  light3.position.set(0, 10, 0)
  //newscene.add(light3)

  let ambientLight = new THREE.AmbientLight(0xf1f1f1, 0.3)
  newscene.add(ambientLight)

  let ambientLight2 = new THREE.AmbientLight(0xffffff, 0.1)
  newscene.add(ambientLight2)

  let ambientLight4 = new THREE.AmbientLight(0x706441, 0.25)
  newscene.add(ambientLight4)

  let ambientLight3 = new THREE.AmbientLight('blanchedalmond', 0.3)
  newscene.add(ambientLight3)

  const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.fov = 20
  camera.position.x = 0
  camera.position.y = 280
  camera.position.z = 0

  const deafult_camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000)
  deafult_camera.fov = 20
  deafult_camera.position.x = 0
  deafult_camera.position.y = 280
  deafult_camera.position.z = 0

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.dampingFactor = 0.1

  controls.enableDamping = true
  controls.enablePan = true
  controls.rotateSpeed = 0.5
  controls.PanSpeed = 1.2
  controls.target.set(0, 0, 0)
  controls.minPolarAngle = Math.PI / 2 - 0.15

  model.traverse(function (node) {
    if (node.isMesh) {
      node.material.side = THREE.DoubleSide
      if (node.material.opacity === 0.7) {
        node.material.transparent = false
      } else {
        node.material.transparent = true
      }
    }
  })

  newscene.add(model)
  //console.log(scene.getObjectByName(model.name + '_').visible)

  allin(scene, model.userData.title, model.name, newscene)
  //console.log(model.id, model.name)
  newscene.userData = model.id

  return newscene
}

function allin(scene, atitle, aname, newscene) {
  const spoting = scene.getObjectByName(aname + '_spotinfo').clone()
  const labing = scene.getObjectByName(aname + '_labinfo').clone()
  spoting.name = 'spot_name'
  labing.name = 'lab_name'
  spoting.visible = true
  newscene.add(spoting)
  newscene.add(labing)

  if (scene.getObjectByName(aname + '_facilityinfo') !== undefined) {
    const facilitying = scene.getObjectByName(aname + '_facilityinfo').clone()
    const equiping = scene.getObjectByName(aname + '_equipmentinfo').clone()
    const equipmodel = scene.getObjectByName(aname + '_equipmodel').clone()
    facilitying.visible = true

    facilitying.name = 'facility_name'
    equiping.name = 'equip_name'

    newscene.add(facilitying)
    newscene.add(equiping)
    newscene.add(equipmodel)
  }
  document.getElementById('annotationsPanel').style.display = 'none'
  const article = document.getElementById(atitle)
  if (aname === '牛舍') {
    //document.getElementById('od').style.display = 'block'
    //console.log('pass_testing...')
  }
  if (article !== null) {
    //article.style.display = 'block'
    //console.log('pass_testing...')
  }
}
