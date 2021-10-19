import './styles.css'
import 'threex-domevents'
import * as THREE from 'three'
import React from 'react'
import ReactDOM from 'react-dom'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useFrame } from 'react-three-fiber'
import Stats from 'three/examples/jsm/libs/stats.module'
import * as TWEEN from 'tween'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { Sky } from './Sky.js'
import { Water } from 'three-stdlib'
import { Modelize } from './Web/Modelize.js'
import { Amodel } from './Web/A_Model.js'
import { Article } from './Web/A_article'
import { Annotate } from './Web/A_annotate'

var over = 0
var out = 0
var now = 0
var num = 0
var concerntrate = 0
let annotations
const annotationMarkers = []
const infoMarkers = []

const backstate = []
const hidestate = []

const closestate = []
const picstate = []

const scene = new THREE.Scene()

//scene.castShadow = true
//scene.receiveShadow = true
scene.background = new THREE.Color('skyblue')
//scene.background = null
//const sky = buildSky()
//const sun = buildSun()
//const river = buildRiver()

var light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(-10, 20, 10)
//scene.add(light)
var light2 = new THREE.DirectionalLight(0x404040, 2)
light2.position.set(10, 20, -10)
scene.add(light2)

var light3 = new THREE.DirectionalLight(0x2a2e1a, 1)
light3.position.set(0, 10, 0)
//scene.add(light3)

let ambientLight = new THREE.AmbientLight(0xf1f1f1, 0.3)
scene.add(ambientLight)

let ambientLight2 = new THREE.AmbientLight(0xffffff, 0.1)
scene.add(ambientLight2)

const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.fov = 20
camera.position.x = 0
camera.position.y = 280
camera.position.z = 0
//camera.position.x = 102;
//camera.position.y = 1.7;
//camera.position.z = 170;

const deafult_camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000)
deafult_camera.fov = 20
deafult_camera.position.x = 0
deafult_camera.position.y = 280
deafult_camera.position.z = 0

const frame = document.getElementById('canvas_frame')

const context = frame.getContext('2d')
const renderer = new THREE.WebGLRenderer({ frame, antialias: true, alpha: false })
renderer.setSize(window.innerWidth, window.innerHeight)

const canvas = frame

canvas.className = 'paint'
canvas.style.color = 'white'

var initializeDomEvents = require('threex-domevents')
var THREEs = require('three')
var THREEx = {}
initializeDomEvents(THREEs, THREEx)
//const domEvents = new THREEx.DomEvents(camera, renderer.domElement)

document.body.appendChild(renderer.domElement)
const labelRenderer = new CSS2DRenderer()

labelRenderer.setSize(window.innerWidth, window.innerHeight)
labelRenderer.domElement.style.position = 'absolute'
labelRenderer.domElement.style.top = '0px'
labelRenderer.domElement.style.pointerEvents = 'none'
document.body.appendChild(labelRenderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.dampingFactor = 0.1
controls.enableDamping = true
controls.enablePan = true
controls.rotateSpeed = 0.5
controls.PanSpeed = 1.2
controls.maxPolarAngle = Math.PI / 2 - 0.2

controls.target.set(0, 0, 0)

const raycaster = new THREE.Raycaster()
const sceneMeshes = new Array()
const gltfs = new Array()
const circleTexture = new THREE.TextureLoader().load('img/circle.png')
//

const getnames = new THREE.FileLoader()
const progressBar = document.getElementById('progressBar')
const backButton = document.getElementById('backButton')
const closeButton = document.getElementById('closeButton')
const hideButton = document.getElementById('hideButton')
const picshow = document.getElementById('picshow')
const closepic = document.getElementById('closepic')
const goright = document.getElementById('goright')
const goleft = document.getElementById('goleft')
const picturespanel = document.getElementById('picturesPanel')

backstate.push(backButton)
closestate.push(closeButton)
hidestate.push(hideButton)
picstate.push(picshow)

//const pics = document.createElement("picture")
//pics.innerHTML = '<img src="/img/行政大樓.jpg" height="100%"  style=" border:3px white solid;">.<img src="/img/行政大樓.jpg"  height="100%"  style="border:3px white solid;">';
//picturespanel.appendChild(pics);

let resourceData
let surroundData
let treedData
var focusing = false

getnames.setMimeType('json')
getnames.load('/trees-0.json', function (all) {
  treedData = JSON.parse(all)
  const gltfloader = new GLTFLoader()
  for (let i = 0; i < treedData.length; i++) {
    gltfloader.load(
      '/glb/tree.glb',
      function (gltf) {
        gltf.scene.position.copy(treedData[i].position)
        scene.add(gltf.scene)
        sceneMeshes.push(gltf.scene)
      },
      undefined,
      function (error) {
        console.error(error)
      },
    )
  }
})
getnames.load('/surround.json', function (all) {
  surroundData = JSON.parse(all)
  const gltfloader = new GLTFLoader()
  for (let i = 0; i < surroundData.length; i++) {
    gltfloader.load(
      surroundData[i].path,
      function (gltf) {
        gltf.scene.position.copy(surroundData[i].position)
        scene.add(gltf.scene)
        sceneMeshes.push(gltf.scene)
      },
      undefined,
      function (error) {
        console.error(error)
      },
    )
  }
})
//Article()
getnames.load('/names.json', function (all) {
  var dom = new THREEx.DomEvents(camera, scene)
  resourceData = JSON.parse(all)
  //console.log( resourceData)
  annotations = resourceData
  //const gltfloader = new GLTFLoader()
  //resourceData.length
  for (let i = 0; i < resourceData.length; i++) {
    Modelize(scene, resourceData[i], gltfs)
    Article(resourceData[i])
  }

  const annotationsPanel = document.getElementById('annotationsPanel')
  const ul = document.createElement('UL')
  const ulElem = annotationsPanel.appendChild(ul)
  backButton.addEventListener('click', function () {
    backDefault()
  })
  closeButton.addEventListener('click', function () {
    Close()
  })
  closepic.addEventListener('click', function () {
    picshow.style.display = 'none'
    closepic.style.display = 'none'
    goleft.style.display = 'none'
    goright.style.display = 'none'
    Focuson()
  })
  const innerpic = document.createElement('div')
  innerpic.id = 'pic'
  picshow.appendChild(innerpic)

  const HideDiv = document.createElement('div')

  hideButton.hideDomElement = HideDiv

  hideButton.addEventListener('click', function () {
    Hide()
  })

  Object.keys(annotations).forEach((a) => {
    const [button, annotationDiv] = Annotate(scene, annotations, a)

    //button.addEventListener("click", function () { gotoAnnotation(annotations[a]); });
    button.addEventListener('click', function () {
      gotoAnnotation(annotations[a])
    })
    button.addEventListener('mouseenter', function () {
      scene.getObjectByName(button.userData).visible = true
    })
    button.addEventListener('mouseleave', function () {
      scene.getObjectByName(button.userData).visible = false
    })

    annotationDiv.addEventListener('click', function () {
      gotoAnnotation(annotations[a])
    })
  })

  //progressBar.style.display = 'none'
  //console.log( picturespanel)
})

var nowscene = new THREE.Scene()
nowscene = scene

//cene.children.length)

canvas.width = window.innerWidth
canvas.height = window.innerHeight

window.addEventListener('resize', onWindowResize, false)
window.addEventListener('orientationchange', () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
})

function onWindowResize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  labelRenderer.setSize(window.innerWidth, window.innerHeight)
  render()
}

renderer.domElement.addEventListener('click', onClick, false)

//console.log(intersects[0].object.parent.id)
//console.log(intersects[0].object.parent.parent.parent.parent.id)
//console.log(intersects[0].object.parent.parent.parent.parent.type)

function onClick(event) {
  raycaster.setFromCamera(
    {
      x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
      y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
    },
    camera,
  )
  const intersects = raycaster.intersectObjects(annotationMarkers, true)
  //console.log(labelRenderer.domElement)
  if (intersects.length > 0) {
    if (intersects[0].object.userData && intersects[0].object.userData.id) {
      gotoAnnotation(annotations[intersects[0].object.userData.id])
    }
  }
}

renderer.domElement.addEventListener('dblclick', onDoubleClick, false)

function onDoubleClick(event) {
  //console.log(event.target.id)
  raycaster.setFromCamera(
    {
      x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
      y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
    },
    camera,
  )
  const intersects = raycaster.intersectObjects(sceneMeshes, true)
  if (intersects.length > 0) {
    const p = intersects[0].point
    new TWEEN.Tween(controls.target)
      .to(
        {
          x: p.x,
          y: p.y,
          z: p.z,
        },
        500,
      )
      .easing(TWEEN.Easing.Cubic.Out)
      .start()
  }
}
renderer.domElement.addEventListener('mousemove', onMousemove, false)

function onMousemove(event) {
  raycaster.setFromCamera(
    {
      x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
      y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
    },
    camera,
  )
  const intersects = raycaster.intersectObjects(gltfs, true)
  if (intersects.length === 0) {
    document.body.style.cursor = ''
    if (now !== 0) {
      const house = scene.getObjectById(now)
      const name = scene.getObjectById(house.userData)
      name.visible = false
      //pointlight.visible=false
      //house.scale.set(1,1,1)
    }
    now = 0
  }
  if (intersects.length > 0) {
    const p = intersects[0].object.userData

    if (p !== now) {
      if (now !== 0) {
        const house = scene.getObjectById(now)
        //house.scale.set(1,1,1)
        const name = scene.getObjectById(house.userData)
        name.visible = false
        document.body.style.cursor = ''
      }
      //console.log(now)

      const house = scene.getObjectById(p)
      const name = scene.getObjectById(house.userData)
      if (house.visible && concerntrate === 0) {
        name.visible = true
        document.body.style.cursor = 'pointer'
      }

      //lighthouse(pointlight,house)
      //house.scale.set(1.05,1.05,1.05)

      now = p
      //console.log(now)
    }
  }
}
renderer.domElement.addEventListener('click', clickmodel, false)
function clickmodel(event) {
  renderer.domElement.removeEventListener('mousemove', onMousemove)
  //console.log('clicked', now)
  raycaster.setFromCamera(
    {
      x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
      y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
    },
    camera,
  )
  const intersects = raycaster.intersectObjects(gltfs, true)

  if (intersects.length > 0) {
    const x = intersects[0].object.userData

    if (concerntrate === 0) {
      hideButton.innerHTML = '▲'
      document.getElementById('articlePanel').style.display = 'block'

      scene.getObjectById(scene.getObjectById(x).userData).visible = false
      document.body.style.cursor = ''
      render()

      concerntrate = 1

      controls.enablePan = false

      const a = scene.getObjectById(x).clone()

      new TWEEN.Tween(camera.position).to(
        {
          x: a.position.x - 30,
          y: a.position.y + 30,
          z: a.position.z + 30,
        },
        1000,
      )
      camera.position.y = a.position.y

      new TWEEN.Tween(controls.target)
        .to(
          {
            x: a.position.x,
            y: a.position.y,
            z: a.position.z,
          },
          500,
        )
        .easing(TWEEN.Easing.Cubic.Out)
        .start()

      controls.update()
      controls.target.x = a.position.x
      controls.target.y = a.position.y
      controls.target.z = a.position.z
      const newscene = Amodel(renderer, a)
      nowscene = newscene
      renderer.domElement.removeEventListener('click', clickmodel)
      document.getElementById('annotationsPanel').style.display = 'none'
      const article = document.getElementById(a.name)
      article.style.display = 'block'
      const mod = document.getElementById('canvas_frame').getContext('2d')
    }
  }
}

function backDefault(a) {
  nowscene = scene

  Showall()

  new TWEEN.Tween(camera.position)
    .to(
      {
        x: deafult_camera.position.x,
        y: deafult_camera.position.y,
        z: deafult_camera.position.z,
      },
      500,
    )
    .easing(TWEEN.Easing.Cubic.Out)
    .start()

  new TWEEN.Tween(controls.target)
    .to(
      {
        x: 0,
        y: 0,
        z: 0,
      },
      500,
    )
    .easing(TWEEN.Easing.Cubic.Out)
    .start()

  const articlepanel = document.getElementById('articlePanel')
  for (let i = 0; i < articlepanel.children.length; i++) {
    articlepanel.children[i].style.display = 'none'
  }
  Object.keys(annotations).forEach((annotation) => {
    if (annotations[annotation].descriptionDomElement) {
      annotations[annotation].descriptionDomElement.style.display = 'none'
    }
    if (annotations[annotation].pictureDomElement) {
      annotations[annotation].pictureDomElement.style.display = 'none'
      picturespanel.style.display = 'none'
    }
  })
}

function Showall() {
  Object.keys(gltfs).forEach((id) => {
    const nn = gltfs[id].name

    scene.getObjectByName(nn).visible = true
    concerntrate = 0
    controls.enablePan = true
  })
  renderer.domElement.addEventListener('mousemove', onMousemove, false)
  renderer.domElement.addEventListener('click', clickmodel, false)
  document.getElementById('annotationsPanel').style.display = 'block'
}

function Clearall() {
  Object.keys(gltfs).forEach((id) => {
    const nn = gltfs[id].name

    scene.getObjectByName(nn).visible = false
    concerntrate = 1
    controls.enablePan = true
  })
}

function Close(a) {
  nowscene = scene
  Showall()

  hideButton.innerHTML = '△'
  const articlepanel = document.getElementById('articlePanel')
  for (let i = 0; i < articlepanel.children.length; i++) {
    articlepanel.children[i].style.display = 'none'
  }
  Object.keys(annotations).forEach((annotation) => {
    if (annotations[annotation].descriptionDomElement) {
      annotations[annotation].descriptionDomElement.style.display = 'none'
    }
    if (annotations[annotation].pictureDomElement) {
      annotations[annotation].pictureDomElement.style.display = 'none'
      picturespanel.style.display = 'none'
    }
  })
}

function Changepic(path) {
  const newpic = document.createElement('picture')
  newpic.innerHTML = path
  var d = document.getElementById('pic')
  picshow.removeChild(d)
  picshow.appendChild(newpic)
  picshow.children[0].id = 'pic'
  picshow.children[0].className = 'innersize'
}
function Focuson() {
  let thisone
  for (let i = 0; i < infoMarkers.length; i++) {
    if (infoMarkers[i].visible) {
      infoMarkers[i].visible = false
      thisone = infoMarkers[i]
    } else {
      infoMarkers[i].visible = true
    }
  }
}

function Hide(a) {
  if (hideButton.innerHTML === '▲') {
    document.getElementById('articlePanel').style.display = 'none'
    hideButton.hideDomElement.style.display = 'none'

    hideButton.innerHTML = '△'
  } else {
    hideButton.innerHTML = '▲'
    document.getElementById('articlePanel').style.display = 'block'
    hideButton.hideDomElement.style.display = 'block'
  }
}

function gotoAnnotation(a) {
  new TWEEN.Tween(camera.position)
    .to(
      {
        x: a.position.x - 30,
        y: a.position.y + 30,
        z: a.position.z + 30,
      },
      500,
    )
    .easing(TWEEN.Easing.Cubic.Out)
    .start()
  new TWEEN.Tween(controls.target)
    .to(
      {
        x: a.position.x,
        y: a.position.y,
        z: a.position.z,
      },
      500,
    )
    .easing(TWEEN.Easing.Cubic.Out)
    .start()
  Object.keys(annotations).forEach((annotation) => {
    if (annotations[annotation].descriptionDomElement) {
      annotations[annotation].descriptionDomElement.style.display = 'none'
    }
    if (annotations[annotation].pictureDomElement) {
      annotations[annotation].pictureDomElement.style.display = 'none'
    }
  })
  if (a.descriptionDomElement) {
    hideButton.innerHTML = '▲'
    hideButton.hideDomElement = a.descriptionDomElement
    a.descriptionDomElement.style.display = 'block'
  }
  if (a.pictureDomElement) {
    a.pictureDomElement.style.display = 'flex'
    picturespanel.style.display = 'inline-block'
  }
}

const stats = Stats()
document.body.appendChild(stats.dom)

function buildSky() {
  const sky = new Sky()
  sky.scale.setScalar(1000)
  sky.material.uniforms['turbidity'] = 0.1
  sky.material.uniforms['mieCoefficient'] = 0.035
  sky.material.uniforms['mieDirectionalG'] = 0.05

  scene.add(sky)
  return sky
}

function buildSun(renderer) {
  const sun = new THREE.Vector3()

  // Defining the x, y and z value for our 3D Vector
  const theta = Math.PI * (0.49 - 0.5)
  const phi = 2 * Math.PI * (0.205 - 0.5)

  //sun.x = Math.cos(phi)+0.5;
  //sun.y = Math.sin(phi) * Math.sin(theta);
  //sun.z = Math.sin(phi) * Math.cos(theta);
  sun.x = 600
  sun.y = 350
  sun.z = -800
  sky.material.uniforms['sunPosition'].value.copy(sun)
  var light = new THREE.DirectionalLight(0xffffff, 1.1)
  var light2 = new THREE.DirectionalLight(0xffe599, 1.1)
  light.position.set(sun.x, sun.y, sun.z)
  light2.position.set(sun.x, sun.y, sun.z)
  scene.add(light)
  scene.add(light2)

  return sun
}

function buildRiver() {
  let geom
  const river = new Water()

  //console.log(river)
  const texloader = new THREE.TextureLoader()
  const objloader = new GLTFLoader()
  const waterNormals = texloader.load('/img/waternormals.jpeg')
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping
  const gltf = objloader.load('/glb/90facewater.glb', function (obj) {
    geom = obj.scene.children[0].geometry
    river.geometry = geom
    //console.log(geom)
  })
  //river.material.uniforms.textureMatrix.value=waterNormals.matrix
  console.log(waterNormals)
  const ang = -Math.PI / 2
  //console.log(ang)
  river.rotateX(ang)
  river.material.uniforms.fogDensity = 1.2
  river.material.uniforms.distortionScale = 3.2
  //river.material.uniforms.waterColor = 0x001e0f
  //console.log(river.material.uniforms.textureMatrix.value)
  river.material.uniforms.normalSampler.value = waterNormals

  river.position.y = 1
  console.log(river.material.uniforms)
  river.castShadow = true
  river.receiveShadow = true
  scene.add(river)
  return river
}

function render() {
  //river.material.uniforms.time.value += 0.05
  labelRenderer.render(nowscene, camera)
  renderer.render(nowscene, camera)
  //domEvents.camera(camera)
}

function fixCanvasBlurInMobileDevice() {
  let devicePixelRatio = window.devicePixelRatio // 取得 devicePixelRatio
  let { width: cssWidth, height: cssHeight } = canvas.getBoundingClientRect() // 獲取css的寬高

  // 根據 devicePixelRatio，擴大 canvas 畫布的像素，使1個canvas像素和 1 個物理像素相等
  canvas.width = devicePixelRatio * cssWidth
  canvas.height = devicePixelRatio * cssHeight

  // 由於畫布擴大，canvas 的坐標系也跟著擴大，如果按照原先的坐標系繪圖內容會縮小
  // 所以需要將繪制比例放大
  context.scale(devicePixelRatio, devicePixelRatio)
}

var animate = function () {
  requestAnimationFrame(animate)

  context.fillRect(0, 0, canvas.width, canvas.height)

  controls.update()
  TWEEN.update()
  render()
  stats.update()
}
render()
animate()
fixCanvasBlurInMobileDevice()
//const objElement = document.getElementById('obj_detect')
//ReactDOM.render(<Detect />, objElement)

//render()
