import * as THREE from 'three'
import { ThreeMFLoader } from 'three-stdlib'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'

export function Abuild(scene, renderer, model, modelname) {
  ////console.log.log(model.id)
  const buildscene = new THREE.Scene()

  buildscene.background = null

  //buildscene.background = new THREE.Color(0xf1f1f1)

  var light = new THREE.DirectionalLight(0xffffff, 1)
  light.position.set(-10, 20, 10)
  //buildscene.add(light)
  var light2 = new THREE.DirectionalLight(0x404040, 1.5)
  light2.position.set(10, 20, -10)
  buildscene.add(light2)

  var light3 = new THREE.DirectionalLight(0x2a2e1a, 1)
  light3.position.set(0, 10, 0)
  //buildscene.add(light3)

  let ambientLight = new THREE.AmbientLight(0xf1f1f1, 0.3)
  buildscene.add(ambientLight)

  let ambientLight2 = new THREE.AmbientLight(0xffffff, 0.1)
  buildscene.add(ambientLight2)

  let ambientLight4 = new THREE.AmbientLight(0x706441, 0.25)
  buildscene.add(ambientLight4)

  let ambientLight3 = new THREE.AmbientLight('blanchedalmond', 0.3)
  buildscene.add(ambientLight3)

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
  controls.enablePan = false
  controls.rotateSpeed = 0.5
  controls.PanSpeed = 1.2
  controls.target.set(0, 0, 0)
  controls.maxDistance = 25
  controls.minDistance = 20
  controls.minPolarAngle = Math.PI / 2 - 0.15
  controls.update()
  controls.maxDistance = Infinity
  buildscene.add(model)
  //modelname.visible = false
  buildscene.add(modelname)

  //console.log.log(modelname.visible)
  const atitle = modelname
  //console.log.log(buildscene.getObjectByName(atitle.name).visible)

  //console.log.log('this?', atitle.name, atitle.userData)
  const aname = model.name

  //console.log.log('inbuild', aname)
  document.getElementById('annotationsPanel').style.display = 'none'
  const article = document.getElementById(atitle)
  if (aname === '牛舍') {
    document.getElementById('od').style.display = 'block'
  }
  if (article !== null) {
    article.style.display = 'block'
  }

  return buildscene
}
