import './styles.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { ThreeJSOverlayView } from '@googlemaps/three'
import Stats from 'three/examples/jsm/libs/stats.module'
import * as TWEEN from 'tween'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'

import { Sky } from './Sky.js'
import { Water } from 'three-stdlib'
import { InfoModelize } from './Web/Model_info'
import { buildModel } from './Web/Model_load'
import { Amodel } from './Web/A_Model'
import { Abuild } from './Web/A_Build'
import { Article } from './Web/A_article'
import { Annotate } from './Web/A_annotate'
import { vid } from './video'
import './Web/A_lab'

import { Element } from './test'
import { string } from '@tensorflow/tfjs'

var current = ''

var over = 0
var out = 0
var now = 0
var now_build = 0
var clicked = 0
var built = false
let ok = 0
var concerntrate = 0
let annotations
const annotationMarkers = []
const infoMarkers = []

const backstate = []
const hidestate = []

const closestate = []
const picstate = []

let temp_cam
const scene = new THREE.Scene()
const mvscene = new THREE.Scene()
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
temp_cam = camera.position

const deafult_camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000)
deafult_camera.fov = 20
deafult_camera.position.x = 0
deafult_camera.position.y = 280
deafult_camera.position.z = 0

const frame = document.getElementById('canvas_frame')

const context = frame.getContext('2d')
const renderer = new THREE.WebGLRenderer({ frame, antialias: true, alpha: false })
const aspect = window.innerHeight / window.innerWidth
renderer.setSize(window.innerWidth, window.innerHeight, false)

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
labelRenderer.domElement.style.position = 'relative'
labelRenderer.domElement.style.top = '0px'
labelRenderer.domElement.style.pointerEvents = 'none'
document.body.appendChild(labelRenderer.domElement)

const mvRenderer = new CSS3DRenderer()
mvRenderer.setSize(window.innerWidth, window.innerHeight)
mvRenderer.domElement.style.position = 'relative'
mvRenderer.domElement.style.top = '0px'

mvRenderer.domElement.style.pointerEvents = 'none'

document.body.appendChild(mvRenderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.dampingFactor = 0.1
controls.enableDamping = true
controls.enablePan = true
controls.rotateSpeed = 0.5
controls.PanSpeed = 1.2
controls.maxPolarAngle = Math.PI / 2 - 0.15

controls.target.set(0, 0, 0)
let newscene

const raycaster = new THREE.Raycaster()
const sceneMeshes = new Array()
const builds = new Array()
const gltfs = new Array()
const spots = new Array()
const labs = new Array()
const facilities = new Array()
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

getnames.load('/-trees-0.json', function (all) {
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
        //console.error(error)
      },
    )
  }
})
getnames.load('/-surround.json', function (all) {
  surroundData = JSON.parse(all)
  const gltfloader = new GLTFLoader()
  //surroundData.length;
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
        //console.error(error)
      },
    )
  }
})

//Article()
getnames.load('/all_models.json', function (all) {
  resourceData = JSON.parse(all)
  annotations = resourceData
  //const gltfloader = new GLTFLoader()
  //resourceData.length
  for (let i = 0; i < resourceData.length; i++) {
    //if (resourceData[i].name === '牛舍') {
    //console.log(resourceData[i])
    buildModel(scene, resourceData[i], builds, gltfs, spots, labs, facilities, mvscene)
    Article(resourceData[i])
    //}
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
//Element(scene, 'v7bnOxV4jAc', { x: 111.343, y: 0, z: 113.824 })

nowscene = scene

//cene.children.length)

canvas.width = window.innerWidth
canvas.height = window.innerHeight

window.addEventListener('orientationchange', () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
})

window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  renderer.setSize(window.innerWidth, window.innerHeight)
  labelRenderer.setSize(window.innerWidth, window.innerHeight)
  mvRenderer.setSize(window.innerWidth, window.innerHeight)
  fixCanvasBlurInMobileDevice()
  //camera.aspect = window.innerWidth / window.innerHeight
  //camera.updateProjectionMatrix()

  render()
}

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

  if (intersects.length > 0) {
    if (intersects[0].object.userData && intersects[0].object.userData.id) {
      gotoAnnotation(annotations[intersects[0].object.userData.id])
    }
  }
}

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

function clickbuild(event) {
  raycaster.setFromCamera(
    {
      x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
      y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
    },
    camera,
  )
  const intersect_build = raycaster.intersectObjects(builds, true)

  if (intersect_build.length === 0) {
    const build = scene.getObjectById(now_build)
    if (build !== undefined) {
      const buildname = scene.getObjectByName(build.userData.title + '_')
      buildname.visible = false
      //const build = scene.getObjectById(now_build)
      //const buildname = scene.getObjectByName(build.name + '_')
      //console.log(0, build.userData)
      //console.log(0, build.name)
      //buildname.visible = false
      //console.log(0, buildname.visible)
      renderer.domElement.removeEventListener('click', clickmodel)
      renderer.domElement.removeEventListener('mousemove', onMousemove)
      renderer.domElement.addEventListener('mousemove', onBuildmove, false)
      //renderer.domElement.removeEventListener('dbclick', clickbuild)
    }
  }

  if (intersect_build.length > 0) {
    const p = intersect_build[0].object.userData
    const build = scene.getObjectById(p)
    if (build !== undefined) {
      const buildname = scene.getObjectByName(build.userData.title + '_')
      buildname.visible = false
      //console.log('clickbuild', 0, build.userData)
      //console.log('clickbuild', 0, build.name)
      //console.log('clickbuild', 0, buildname.visible)

      //const name = scene.getObjectById(scene.getObjectByName(scene.getObjectByName(build.userData.title).name).userData)
      //name.visible = false

      const a = scene.getObjectById(p)
      current = a.userData.title
      console.log(current)
      if (a !== undefined) {
        //console.log(ok)
        //console.log('ok?', ok)
        if (ok === 0) {
          gotoAnnotation(a)

          ok = 1
        } else if (ok === 1) {
          built = true
          //const thisbuild = scene.getObjectByName(build.userData.title)
          //const thisname = scene.getObjectByName(build.userData.title + '_')
          const thisbuild = scene.getObjectByName(build.userData.title).clone()
          const thisname = scene.getObjectByName(build.userData.title + '_').clone()
          //const thistitle = scene.getObject
          //console.log('?', build.userData.title)
          if (thisbuild !== undefined) {
            //console.log(thisbuild.name)
            //console.log(thisbuild.userData)
            newscene = Abuild(scene, renderer, thisbuild, thisname)

            //thisbuild.visible = false
          }

          nowscene = newscene
          renderer.domElement.addEventListener('mousemove', onMousemove, false)
          renderer.domElement.addEventListener('click', clickmodel, false)
          renderer.domElement.removeEventListener('click', clickbuild)
          renderer.setViewport(window.innerWidth * 0.5, window.innerHeight * 0.5, window.innerWidth * 0.5, window.innerHeight * 0.5)
          var w = window.innerWidth
          var h = window.innerHeight
          var ofst = renderer.getViewport(new THREE.Vector4(0, 0, 0, 0))
          console.log(1, ofst.z / w, ofst.w / h)
          console.log(ofst)

          labelRenderer.domElement.style.transform = 'scale(' + ofst.z / w + ',' + ofst.w / h + ')'
          mvRenderer.domElement.style.transform = 'scale(' + ofst.z / w + ',' + ofst.w / h + ')'
          labelRenderer.domElement.style.top = h - ofst.y + 'px'
          labelRenderer.domElement.style.top = ofst.x + 'px'
          mvRenderer.domElement.style.top = h - ofst.y + 'px'
          mvRenderer.domElement.style.left = ofst.x + 'px'
          console.log(labelRenderer.domElement.style)
          console.log(mvRenderer.domElement.style)

          //renderer.domElement.removeEventListener('mousemove', onBuildmove)

          //console.log(buildname.name)
          //console.log(build.userData)
          document.getElementById(build.userData.title).style.display = 'block'
          hideButton.innerHTML = '▲'
          const model_names = document.getElementsByClassName('buildName')
          for (let i = 0; i < model_names.length; i++) {
            model_names[i].style.display = 'none'
            //console.log(model_names[i].style)
          }
        }
      }
    }
  }
}
function onBuildmove(event) {
  raycaster.setFromCamera(
    {
      x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
      y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
    },
    camera,
  )

  const intersects = raycaster.intersectObjects(builds, true)
  //console.log(built)

  if (intersects.length === 0) {
    ok = 0
    document.body.style.cursor = ''
    if (now_build !== 0) {
      const build = scene.getObjectById(now_build)
      if (build !== undefined) {
        const buildname = scene.getObjectByName(build.userData.title + '_')
        const buildnames = document.getElementsByClassName('buildName')
        for (let i = 0; i < buildnames.length; i++) {
          buildnames[i].style.display = 'none'
          //console.log(buildnames[i].style.display)
        }
        //console.log('onBuildmove', 0, build.userData)
        //console.log('onBuildmove', 0, build.name)
        buildname.visible = false
        //console.log('onBuildmove', 0, buildname.visible)
      }
    }
    //renderer.domElement.removeEventListener('click', clickbuild)
    //pointlight.visible=false
    //build.scale.set(1,1,1)
    now_build = 0
  }

  if (intersects.length > 0) {
    const p = intersects[0].object.userData

    //renderer.domElement.addEventListener('click', clickbuild, false)

    if (p !== now_build) {
      if (now_build !== 0) {
        const build = scene.getObjectById(now_build)
        //console.log(build.name)
        const buildnames = document.getElementsByClassName('buildName')
        for (let i = 0; i < buildnames.length; i++) {
          buildnames[i].style.display = 'none'
          ok = 0
        }
        if (build !== undefined) {
          ok = 0
          const buildname = scene.getObjectByName(build.userData.title + '_')
          //console.log('onBuildmove', 1, build.userData)
          //console.log('onBuildmove', 1, build.name)

          //console.log(buildnames[i].style.display)

          buildname.visible = false

          //console.log('onBuildmove', 1, buildname.visile)
        }
        document.body.style.cursor = ''
      }

      controls.saveState()
      temp_cam = camera.position
      //renderer.domElement.removeEventListener('click', clickbuild)

      //console.log(now_build)

      const build = scene.getObjectById(p)
      if (build !== undefined) {
        const buildname = scene.getObjectByName(build.userData.title + '_')
        //console.log('onBuildmove', 2, build.userData)
        //console.log('onBuildmove', 2, build.name)
        buildname.visible = true
        //console.log('onBuildmove', 2, buildname.visible)

        //const name = scene.getObjectById(scene.getObjectByName(scene.getObjectByName(build.userData.title).name).userData)
        document.body.style.cursor = 'pointer'
      }
      now_build = p
      //renderer.domElement.addEventListener('click', clickbuild, false)

      //lightbuild(pointlight,build)
      //build.scale.set(1.05,1.05,1.05)

      //console.log(now_build)
    } else if (built === true) {
      const build = scene.getObjectById(p)
      if (build !== undefined) {
        const buildname = scene.getObjectByName(build.userData.title + '_')
        //console.log('onBuildmove', 3, build.userData)
        //console.log('onBuildmove', 3, build.name)
        buildname.visible = false
        const buildnames = document.getElementsByClassName('buildName')
        for (let i = 0; i < buildnames.length; i++) {
          buildnames[i].style.display = 'none'
          //console.log(buildnames[i].style.display)
        }
        now_build = p
      }
      //renderer.domElement.addEventListener('click', clickbuild, false)
      now_build = p
    }
  }
}

function onFacilitymove(event) {
  raycaster.setFromCamera(
    {
      x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
      y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
    },
    camera,
  )
  const intersect_facility = raycaster.intersectObjects(facilities, true)
  if (intersect_facility.length === 0) {
    if (newscene !== undefined) {
      labs.forEach(function (labels) {
        if (newscene.getObjectByName(labels.name) !== undefined) {
          newscene.getObjectByName(labels.name).visible = false
        }
      })
    }
    document.body.style.cursor = ''
    renderer.domElement.removeEventListener('click', clickfacility)
  }
  //console.log(clicked)
  if (intersect_facility.length > 0 && intersect_facility[0].object.visible === true && clicked === 0) {
    if (newscene.getObjectByName(intersect_facility[0].object.userData) !== undefined) {
      newscene.getObjectByName(intersect_facility[0].object.userData).visible = true
    }
    //console.log(clicked)

    renderer.domElement.addEventListener('click', clickfacility, false)

    document.body.style.cursor = 'pointer'
    controls.saveState()

    controls.update()
  }
}

function onSpotmove(event) {
  raycaster.setFromCamera(
    {
      x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
      y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
    },
    camera,
  )
  const intersect_spot = raycaster.intersectObjects(spots, true)
  if (intersect_spot.length === 0) {
    if (newscene !== undefined) {
      labs.forEach(function (labels) {
        if (newscene.getObjectByName(labels.name) !== undefined) {
          newscene.getObjectByName(labels.name).visible = false
        }
      })
    }
    renderer.domElement.removeEventListener('click', clickspot)

    document.body.style.cursor = ''
  }
  if (intersect_spot.length > 0 && intersect_spot[0].object.visible === true) {
    if (newscene.getObjectByName(intersect_spot[0].object.userData) !== undefined) {
      newscene.getObjectByName(intersect_spot[0].object.userData).visible = true
      console.log(newscene.getObjectByName(intersect_spot[0].object.name).name)
    }
    renderer.domElement.addEventListener('click', clickspot, false)
    document.body.style.cursor = 'pointer'
  }
}

function onMousemove(event) {
  const a = renderer.getViewport(new THREE.Vector4(0, 0, 0, 0))
  console.log(a.x, a.y, a.z, a.w)
  raycaster.setFromCamera(
    {
      x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
      y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
    },
    camera,
  )
  if (
    renderer.domElement.clientWidth - (a.z + a.x) <= event.clientX &&
    event.clientX >= a.x &&
    renderer.domElement.clientHeight - a.y - a.w <= event.clientY &&
    event.clientY <= renderer.domElement.clientHeight - a.y
  ) {
    console.log('x', ((event.clientX - a.x) / a.z) * 2 - 1)
    console.log('y', (-(event.clientY - (renderer.domElement.clientHeight - a.w - a.y)) / a.w) * 2 + 1)
  }

  //console.log(scene.getObjectById(now) !== undefined)
  const intersects = raycaster.intersectObjects(builds, true)
  if (intersects.length === 0) {
    //renderer.domElement.removeEventListener('click', clickmodel)
    //console.log(now)
    document.body.style.cursor = ''

    const house = scene.getObjectById(now)
    //console.log('000', 0, house.userData)
    //const house = scene.getObjectById(p)
    if (house !== undefined) {
      const housename = scene.getObjectByName(house.name + '_')

      //console.log('onMousemove', 0, house.name)
      //console.log(house.userData)
      //console.log('onMousemove', 0, house.visible)
      if (newscene.getObjectByName(house.name + '_') !== undefined) {
        if (newscene.getObjectByName(house.name + '_') !== undefined) {
          newscene.getObjectByName(house.name + '_').visible = false
        }
      }

      //newscene.getObjectByName(house.userData.title + '_').visible = false
      if (newscene.getObjectByName(house.userData.title + '_') !== undefined) {
        newscene.getObjectByName(house.userData.title + '_').visible = false
      }

      //console.log('onMousemove', 0, newscene.getObjectByName(house.name + '_').visible)

      //console.log('onMousemove', 0, housename.name)
    }

    //const house = scene.getObjectById(now)
    //const house = scene.getObjectById(p)
    //console.log(house.userData)
    //const housename = scene.getObjectByName(house.name + '_')

    //console.log(0, 0, house.name)
    //console.log(0, 0, housename.name)
  }
  if (intersects.length > 0) {
    const p = intersects[0].object.userData
    //console.log(p, now)

    if (p !== now) {
      if (now !== 0) {
        const house = scene.getObjectById(now)

        //console.log('000', 1, house.userData)
        //const house = scene.getObjectById(p)
        //const housename = newscene.getObjectByName(house.name + '_')

        //console.log('onMousemove', housename.name)
        document.body.style.cursor = ''
        //console.log('onMousemove', 1, house.visible)
        if (house !== undefined) {
          if (newscene.getObjectByName(house.name + '_') !== undefined) {
            newscene.getObjectByName(house.name + '_').visible = false
          }
          //newscene.getObjectByName(house.userData.title + '_').visible = false
          if (newscene.getObjectByName(house.userData.title + '_') !== undefined) {
            newscene.getObjectByName(house.userData.title + '_').visible = false
          }
        }
        //console.log('onMousemove', 1, newscene.getObjectByName(house.name + '_').visible)

        //console.log('onMousemove', 1, housename.name)
      }
      now = p
      //console.log(now)
      //const house = scene.getObjectById(now)

      const house = scene.getObjectById(p)
      if (house !== undefined) {
        //const housename = scene.getObjectByName(house.name + '_')

        //console.log('000', 2, house.userData)-
        //console.log('onMousemove', 0, 2, housename.name)

        //console.log('onMousemove', 0, 2, house.name)
        if (house.userData.title === current) {
          document.body.style.cursor = 'pointer'
        }
        //console.log('onMousemove', 0, 2, house.visible)
        if (newscene.getObjectByName(house.name + '_') !== undefined) {
          newscene.getObjectByName(house.name + '_').visible = true
        }

        //newscene.getObjectByName(house.userData.title + '_').visible = false
        if (newscene.getObjectByName(house.userData.title + '_') !== undefined) {
          newscene.getObjectByName(house.userData.title + '_').visible = false
        }
      }
      //console.log('onMousemove', 0, 2, newscene.getObjectByName(house.name + '_').visible)
      //console.log('onMousemove', 0, 2, housename.name)
      //console.log(0, 2, housename.name)

      //lighthouse(pointlight,house)
      //house.scale.set(1.05,1.05,1.05)

      //console.log(now)
    } else if (p === now) {
      const house = scene.getObjectById(p)
      if (house !== undefined) {
        const housename = scene.getObjectByName(house.name + '_')
        //console.log('000', 2, house.userData)
        //console.log('onMousemove', 0, 2, house.name)
        //console.log(house.userData.title)
        //console.log('onMousemove', 0, 3, housename.name)
        if (house.userData.title === current) {
          document.body.style.cursor = 'pointer'
        }
        //document.body.style.cursor = 'pointer'
        //console.log('onMousemove', 0, 2, house.visible)
        if (newscene.getObjectByName(house.name + '_') !== undefined) {
          newscene.getObjectByName(house.name + '_').visible = true
        }

        //newscene.getObjectByName(house.userData.title + '_').visible = false
        if (newscene.getObjectByName(house.userData.title + '_') !== undefined) {
          newscene.getObjectByName(house.userData.title + '_').visible = false
        }
      }

      //console.log('onMousemove', 0, 2, newscene.getObjectByName(house.name + '_').visible)
      //console.log('onMousemove', 0, 2, housename.name)
    }
  }
}

function clickelse(event) {
  raycaster.setFromCamera(
    {
      x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
      y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
    },
    camera,
  )
  const intersect_facility = raycaster.intersectObjects(facilities, true)
  if (intersect_facility.length === 0) {
    //console.log('outside!', clicked)
    if (clicked === 1) {
      //console.log('clicked else!')
      //console.log('db')
      //console.log(controls.maxDistance, controls.minDistance)
      //camera.position.set(controls.position0)
      //controls.target.set(controls.target0)

      controls.enablePan = true
      controls.maxDistance = 3
      controls.minDistance = 3
      controls.maxPolarAngle = Math.PI / 2 - 0.15
      controls.minPolarAngle = 0
      controls.enableRotate = true
      controls.update()

      controls.minDistance = 1
      mvscene.getObjectByName('mv_lilac').visible = false
      const facilitydisplay = newscene.getObjectByName('facility_name')
      facilitydisplay.visible = true

      renderer.domElement.addEventListener('mousemove', onFacilitymove, false)
      clicked = 0
      renderer.domElement.removeEventListener('click', clickelse)
    }
  }
}
function clickfacility(event) {
  raycaster.setFromCamera(
    {
      x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
      y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
    },
    camera,
  )
  const intersect_facility = raycaster.intersectObjects(facilities, true)

  if (intersect_facility.length > 0) {
    //console.log('clicked facility!')
    //renderer.domElement.addEventListener('click', clickmodel)
    //console.log(intersect_facility[0].object.name)

    const pos = intersect_facility[0].object.position

    if (intersect_facility[0].object.name === 'facility_demo影片') {
      const mv_pos = mvscene.getObjectByName('mv_lilac').position
      mvscene.getObjectByName('mv_lilac').visible = true
      console.log(mvscene.getObjectByName('mv_lilac').position)
      console.log(mvscene.getObjectByName('mv_lilac').rotation)

      new TWEEN.Tween(camera.position).to(
        {
          x: 115,
          y: mv_pos.y,
          z: 115,
        },
        1000,
      )
      camera.rotateY(THREE.Math.degToRad(113.654))
      new TWEEN.Tween(controls.target)
        .to(
          {
            x: pos.x,
            y: pos.y,
            z: pos.z,
          },
          500,
        )
        .easing(TWEEN.Easing.Cubic.Out)
        .start()
      //camera.rotateY(THREE.Math.degToRad(-113.654))

      controls.maxPolarAngle = Math.PI / 2
      controls.minPolarAngle = Math.PI / 2

      //camera.position.copy(cam_pos)
      //controls.maxDistance = 3
      //controls.minDistance = 3
      //camera.rotateY(THREE.Math.degToRad(113.654))

      //controls.enableRotate = false
    } else {
      new TWEEN.Tween(camera.position).to(
        {
          x: pos.x - 1,
          y: pos.y - 0.5,
          z: pos.z + 1,
        },
        1000,
      )

      new TWEEN.Tween(controls.target)
        .to(
          {
            x: pos.x,
            y: pos.y,
            z: pos.z,
          },
          500,
        )
        .easing(TWEEN.Easing.Cubic.Out)
        .start()

      controls.maxDistance = 2
      controls.minDistance = 2
    }
    controls.update()

    //controls.maxDistance = 2.5
    //controls.minDistance = 1
    controls.enablePan = false

    controls.dampingFactor = 0.25

    //controls.update(controls.minDistance, controls.maxDistance)
    //console.log()

    clicked = 1
    const facilitydisplay = newscene.getObjectByName('facility_name')
    facilitydisplay.visible = false

    renderer.domElement.removeEventListener('click', clickfacility)

    renderer.domElement.addEventListener('dblclick', clickelse, false)
  }
}

function clickspot(event) {
  raycaster.setFromCamera(
    {
      x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
      y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
    },
    camera,
  )
  const intersect_spot = raycaster.intersectObjects(spots, true)

  if (intersect_spot.length > 0) {
    //console.log('clicked spot!')
    const temp = intersect_spot[0].object.userData + '_facilityinfo'
    const equipinfo = newscene.getObjectByName(temp)

    if (equipinfo !== undefined) {
      equipinfo.visible = true
    }

    new TWEEN.Tween(camera.position).to(
      {
        x: intersect_spot[0].object.position.x + 3,
        y: intersect_spot[0].object.position.y,
        z: intersect_spot[0].object.position.z - 3,
      },
      1000,
    )

    new TWEEN.Tween(controls.target)
      .to(
        {
          x: intersect_spot[0].object.position.x,
          y: intersect_spot[0].object.position.y,
          z: intersect_spot[0].object.position.z,
        },
        500,
      )
      .easing(TWEEN.Easing.Cubic.Out)
      .start()

    controls.maxDistance = 3
    controls.minDistance = 3
    controls.enablePan = true
    controls.dampingFactor = 0.25

    controls.PanSpeed = 3.5
    controls.saveState()

    const spotdisplay = newscene.getObjectByName('spot_name')
    spotdisplay.visible = false
    if (newscene !== undefined) {
      labs.forEach(function (labels) {
        if (newscene.getObjectByName(labels.name) !== undefined) {
          newscene.getObjectByName(labels.name).visible = false
        }
      })
    }
    //newscene.getObjectByName(intersect_spot[0].object.userData).visible = false

    renderer.domElement.addEventListener('mousemove', onFacilitymove, false)
    renderer.domElement.addEventListener('dblclick', clickelse, false)
    clicked = 0
    renderer.domElement.addEventListener('click', clickfacility, false)
    renderer.domElement.removeEventListener('click', clickspot)
    renderer.domElement.removeEventListener('mousemove', onSpotmove)
  }
}

function clickmodel(event) {
  //console.log('clicked', now)

  raycaster.setFromCamera(
    {
      x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
      y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
    },
    camera,
  )
  const intersects = raycaster.intersectObjects(builds, true)

  if (intersects.length > 0) {
    //console.log('clicked model!')
    const x = intersects[0].object.userData
    //console.log(intersects[0].object.name)
    //console.log(x)

    const house = scene.getObjectById(x)

    if (house.userData.title === current) {
      //console.log(house.name, house.userData, 'ttt')
      const verify = controls.target.x === house.position.x && controls.target.y === house.position.y && controls.target.z === house.position.z
      built = verify
      //console.log(ok)
      //console.log(built)
      if (ok === 0) {
        //renderer.domElement.removeEventListener('click', clickmodel)
        //renderer.domElement.removeEventListener('mousemove', onMousemove)
        //renderer.domElement.addEventListener('mousemove', onBuildmove, false)
      }
      if (concerntrate === 0) {
        hideButton.innerHTML = '▲'
        document.getElementById('articlePanel').style.display = 'block'

        scene.getObjectById(scene.getObjectById(x).userData.id).visible = false
        scene.getObjectById(scene.getObjectByName(scene.getObjectByName(scene.getObjectById(x).userData.title).name).userData).visible = false

        document.body.style.cursor = ''
        render()

        concerntrate = 1

        controls.enablePan = false
        controls.PanSpeed = 2

        const a = scene.getObjectById(x).clone()
        //const a = scene.getObjectById(x)
        //console.log(a.position)
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

        scene.getObjectByName(a.name + '_').visible = false

        //const thisname = scene.getObjectByName(a.name + '_')
        const thisname = scene.getObjectByName(a.name + '_').clone()

        newscene.clear()
        newscene = Amodel(scene, renderer, a)
        //console.log(labelRenderer.domElement)
        const css = document.getElementsByClassName('modelName')
        //console.log(css)
        for (let i = 0; i < css.length; i++) {
          css[i].style.display = 'none'
        }
        //console.log()
        //labelRenderer.domElement.style.display = 'none'
        //console.log(labelRenderer.domElement.style.display)
        newscene.add(thisname)
        //console.log(thisname.name)

        //console.log(newscene.getObjectByName(thisname.name).visible)
        //Element(newscene, 'v7bnOxV4jAc', { x: 111.343, y: 0, z: 113.824 })
        //vid(camera, newscene, renderer, controls, { x: 111.343, y: 0, z: 113.824 })

        nowscene = newscene

        renderer.domElement.addEventListener('mousemove', onSpotmove, false)

        renderer.domElement.removeEventListener('click', clickmodel)
        renderer.domElement.removeEventListener('mousemove', onBuildmove)
        renderer.domElement.removeEventListener('mousemove', onMousemove)
        thisname.visible = false
        renderer.domElement.removeEventListener('click', clickmodel)
      }

      controls.maxDistance = 20
      controls.minDistance = 20
      controls.update()
    }
  }
}

function backDefault(a) {
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
    document.getElementById('od').style.display = 'none'

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
  mvscene.getObjectByName('mv_lilac').visible = false
  controls.maxPolarAngle = Math.PI / 2 - 0.15
  controls.minPolarAngle = 0
  controls.enableRotate = true
  controls.maxDistance = Infinity
  controls.minDistance = 0
  controls.PanSpeed = 1.2
  clicked = 0
  built = false
  controls.update()
  renderer.domElement.removeEventListener('mousemove', onSpotmove)
  renderer.domElement.removeEventListener('click', clickspot)
  renderer.domElement.removeEventListener('mousemove', onMousemove)
  renderer.domElement.removeEventListener('click', clickmodel)

  if (newscene !== undefined) {
    labs.forEach(function (labels) {
      if (newscene.getObjectByName(labels.name) !== undefined) {
        newscene.getObjectByName(labels.name).visible = false
      }
    })
    const now_id = newscene.userData
    const now_model = newscene.getObjectById(now_id)
    if (now_model !== undefined) {
      //console.log('yes')
      now_model.traverse(function (node) {
        if (node.isMesh) {
          if (node.material.opacity === 0.7) {
            node.material.transparent = false
          }
        }
      })
    }
  }
  nowscene = scene
  Object.keys(gltfs).forEach((id) => {
    const nn = gltfs[id].name

    scene.getObjectByName(nn).visible = true
    concerntrate = 0
    controls.enablePan = true
  })
  renderer.domElement.addEventListener('mousemove', onBuildmove, false)
  renderer.domElement.addEventListener('click', clickbuild, false)
  document.getElementById('annotationsPanel').style.display = 'block'
}

function Clearall() {
  mvscene.getObjectByName('mv_lilac').visible = false
  spots.forEach(function (aspot) {
    aspot.visible = false
  })
  Object.keys(gltfs).forEach((id) => {
    const nn = gltfs[id].name

    scene.getObjectByName(nn).visible = false
    concerntrate = 1
    controls.enablePan = true
  })
}

function Close(a) {
  Showall()

  hideButton.innerHTML = '△'

  document.getElementById('od').style.display = 'none'
  document.getElementById('labPanel').style.display = 'none'

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
    document.getElementById('od').style.display = 'none'

    document.getElementById('articlePanel').style.display = 'none'
    hideButton.hideDomElement.style.display = 'none'

    hideButton.innerHTML = '△'
  } else {
    hideButton.innerHTML = '▲'

    document.getElementById('od').style.display = 'block'

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
  sun.x = 550
  sun.y = 300
  sun.z = -500
  sky.material.uniforms['sunPosition'].value.copy(sun)
  var light = new THREE.DirectionalLight(0xffffff, 1.1)
  var light2 = new THREE.DirectionalLight(0xffe599, 1.1)
  light.position.set(sun.x, sun.y, sun.z)
  light2.position.set(sun.x, sun.y, sun.z)
  //scene.add(light)
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
  //console.log(waterNormals)
  const ang = -Math.PI / 2
  //console.log(ang)
  river.rotateX(ang)
  river.material.uniforms.fogDensity = 1.2
  river.material.uniforms.distortionScale = 3.2
  //river.material.uniforms.waterColor = 0x001e0f
  //console.log(river.material.uniforms.textureMatrix.value)
  river.material.uniforms.normalSampler.value = waterNormals

  river.position.y = 1
  //console.log(river.material.uniforms)
  river.castShadow = true
  river.receiveShadow = true
  scene.add(river)
  return river
}

function render() {
  //river.material.uniforms.time.value += 0.05
  labelRenderer.render(nowscene, camera)
  mvRenderer.render(mvscene, camera)
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

function id_check() {
  navigator.mediaDevices
    .enumerateDevices()
    .then(function (devices) {
      devices.forEach(function (device) {
        //console.log(device.kind + ': ' + device.label + ' id = ' + device.deviceId)
      })
    })
    .catch(function (err) {
      //console.log(err.name + ': ' + err.message)
    })
}

function resetevent(event) {
  renderer.domElement.addEventListener('click', onClick, false)
  renderer.domElement.addEventListener('dblclick', onDoubleClick, false)
  renderer.domElement.addEventListener('mousemove', onBuildmove, false)
  renderer.domElement.addEventListener('click', clickbuild, false)
  //renderer.domElement.addEventListener('dbclick', clickbuild, false)
}
resetevent()

//const objElement = document.getElementById('obj_detect')
//ReactDOM.render(<Detect />, objElement)

animate()

//render()
