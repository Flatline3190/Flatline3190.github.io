import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'

import { Article } from './f_article'
import { Element } from '/src/test'

const gltfloader = new GLTFLoader()
const getnames = new THREE.FileLoader()

function model_load(resourceData, gltfs, equipments, mvscene) {
  gltfloader.load(
    resourceData.path,
    function (gltf) {
      const view = gltf.scene
      //console.log(resourceData.name)

      view.position.copy(resourceData.position)
      if (resourceData.name !== '牛舍柵欄') {
        view.rotateY(THREE.Math.degToRad(113.654))
      }
      if (resourceData.name === 'demo影片') {
        const mv = Element('v7bnOxV4jAc')
        mv.position.copy(resourceData.position)
        mv.rotateY(THREE.Math.degToRad(113.654))
        mv.name = 'mv_lilac'
        mv.visible = false
        mvscene.add(mv)
      }
      view.traverse(function (node) {
        if (node.isMesh) {
          node.material.side = THREE.DoubleSide

          if (node.material.opacity === 1.0) {
            node.material.transparent = false
            //node.material.opacity = 0.7
          }
        }
      })
      view.name = resourceData.name

      // gltfs.push(view)
      equipments.add(view)
    },

    undefined,
    function (error) {
      console.error(error)
    },
  )
}
function Equipments(scene, aspot, spotgroup, labgroup, facilities, labs, gltfs, equipments, mvscene, title) {
  const facility = aspot.facility
  console.log(aspot.name)
  const facilitygroup = new THREE.Group()
  const equipmentgroup = new THREE.Group()
  const facilityDiv_ = document.createElement('div')
  facilityDiv_.className = 'info'
  //surroundData.length;
  if (title === '牛舍') {
    for (let i = 0; i < facility.length; i++) {
      console.log(facility[i])
      Article(facility[i])
    }
  }
  for (let i = 0; i < facility.length; i++) {
    const facilityDiv = document.createElement('div')
    facilityDiv_.appendChild(facilityDiv)
    facilityDiv.className = 'pointerName'
    facilityDiv.innerHTML = facility[i].name
    const facilityLabel = new CSS2DObject(facilityDiv)

    facilityLabel.position.copy(facility[i].position)
    facilityLabel.position.y += 0.5

    facilityLabel.name = facility[i].name
    //

    const map = new THREE.TextureLoader().load('./img/circle.png')
    const sp_material = new THREE.SpriteMaterial({ map: map, depthTest: true, sizeAttenuation: true, depthWrite: false })
    const sprite = new THREE.Sprite(sp_material)

    sprite.scale.set(0.25, 0.25, 0.25)

    sprite.position.copy(facility[i].position)
    sprite.position.y = sprite.position.y + 0.25
    sprite.position.x = sprite.position.x + 0.15
    sprite.rotateY(THREE.Math.degToRad(113.654))

    ////////////
    facilityLabel.visible = false
    //spotgroup.add(spotLabel)
    facilitygroup.add(sprite)
    equipmentgroup.add(facilityLabel)
    sprite.name = 'facility_' + facility[i].name
    sprite.userData = facilityLabel.name
    facilities.push(sprite)
    labs.push(facilityLabel)
    model_load(facility[i], gltfs, equipments, mvscene)

    //////
  }

  facilitygroup.visible = false
  facilitygroup.name = aspot.lab + '_facilityinfo'
  equipmentgroup.name = aspot.lab + '_equipmentinfo'

  spotgroup.add(facilitygroup)
  labgroup.add(equipmentgroup)

  /////////////////////////////
}
function SpotInfo(scene, resourceData, spots, labs, facilities, gltfs, mvscene, title) {
  const spotgroup = new THREE.Object3D()
  const labgroup = new THREE.Object3D()
  const fcty = new THREE.Object3D()
  const eqpt = new THREE.Object3D()
  const equipments = new THREE.Group()
  const spotDiv_ = document.createElement('div')
  spotDiv_.className = 'info'
  //surroundData.length;
  for (let i = 0; i < resourceData.spot.length; i++) {
    const aspot = resourceData.spot[i]
    const spotDiv = document.createElement('div')
    spotDiv_.appendChild(spotDiv)
    spotDiv.className = 'pointerName'
    spotDiv.innerHTML = aspot.lab
    const spotLabel = new CSS2DObject(spotDiv)

    spotLabel.position.copy(aspot.location)
    spotLabel.position.y += 2
    spotLabel.name = aspot.lab
    //
    const material = new THREE.LineBasicMaterial({ color: 0x000000 })
    const points = []
    points.push(new THREE.Vector3(aspot.location.x, aspot.location.y, aspot.location.z))
    points.push(new THREE.Vector3(aspot.location.x, aspot.location.y - 2, aspot.location.z))
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const line = new THREE.Line(geometry, material)
    ///
    const map = new THREE.TextureLoader().load('./img/circle.png')
    const sp_material = new THREE.SpriteMaterial({ map: map, depthTest: true, sizeAttenuation: true, depthWrite: false })
    const sprite = new THREE.Sprite(sp_material)
    sprite.scale.set(1, 1, 1)
    sprite.position.copy(aspot.location)
    //sprite.position.y = sprite.position.y

    ////////////
    spotLabel.visible = false
    //spotgroup.add(spotLabel)
    spotgroup.add(line)
    spotgroup.add(sprite)
    labgroup.add(spotLabel)

    sprite.name = resourceData.name + '_' + aspot.lab
    sprite.userData = spotLabel.name
    line.name = sprite.userData + '_line'
    spots.push(sprite)
    labs.push(spotLabel)

    if (aspot.facility !== undefined) {
      Equipments(scene, aspot, fcty, eqpt, facilities, labs, gltfs, equipments, mvscene, title)
    }

    //////
  }
  spotgroup.visible = false
  fcty.visible = false

  spotgroup.name = resourceData.name + '_spotinfo'
  labgroup.name = resourceData.name + '_labinfo'
  fcty.name = resourceData.name + '_facilityinfo'
  eqpt.name = resourceData.name + '_equipmentinfo'
  equipments.name = resourceData.name + '_equipmodel'

  scene.add(spotgroup)
  scene.add(labgroup)
  scene.add(fcty)
  scene.add(eqpt)
  scene.add(equipments)

  /////////////////////////////
}

function InfoModelize(title, scene, resourceData, gltfs, spots, labs, facilities, mvscene) {
  //console.log(gltfs)

  //console.log(resourceData.path)
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
      if (resourceData.name === '行政大樓_1F') {
        nannotationLabel.position.y = resourceData.position.y + 2
      } else if (resourceData.name === '行政大樓_RF') {
        nannotationLabel.position.y = resourceData.position.y + 8
      } else {
        nannotationLabel.position.y = resourceData.position.y + 5
      }
      //nannotationLabel.position.y = resourceData.position.y + 5
      view.userData.id = nannotationLabel.id
      view.userData.title = title
      nannotationLabel.name = resourceData.name + '_'
      nannotationLabel.visible = false

      if (resourceData.name !== '行政大樓_RF') {
        scene.add(nannotationLabel)
      }

      view.traverse(function (node) {
        if (node.isMesh) {
          node.userData = view.id
          node.material.side = THREE.DoubleSide
          //console.log(node.material.opacity)
          if (node.material.opacity === 1.0) {
            node.material.transparent = false
            node.material.opacity = 0.7
          } else if (node.material.opacity < 0.7) {
            node.material.transparent = true
          }
        }
      })
      view.name = resourceData.name
      //console.log(view.name, view.userData, nannotationLabel.id)
      scene.add(view)
      //gltfs.push(view)
      SpotInfo(scene, resourceData, spots, labs, facilities, gltfs, mvscene, title)
    },

    undefined,
    function (error) {
      console.error(error)
    },
  )
}

export function buildModel(scene, resourceData, builds, gltfs, spots, labs, facilities, mvscene) {
  //console.log(gltfs)

  const model_group = new THREE.Group()
  const nannotationDiv = document.createElement('div')
  nannotationDiv.className = 'buildName'
  nannotationDiv.innerHTML = resourceData.name

  const nannotationLabel = new CSS2DObject(nannotationDiv)
  nannotationLabel.position.copy(resourceData.position)
  nannotationLabel.position.y = resourceData.position.y + 5
  nannotationLabel.name = resourceData.name + '_'
  nannotationLabel.visible = false
  //console.log(nannotationLabel.name)

  scene.add(nannotationLabel)

  model_group.userData = nannotationLabel.id
  model_group.name = resourceData.name
  //console.log(model_group.name, model_group.userData)

  const places = resourceData.place
  for (let i = 0; i < places.length; i++) {
    //console.log(places[i])
    InfoModelize(resourceData.name, model_group, places[i], gltfs, spots, labs, facilities, mvscene)
  }
  scene.add(model_group)
  builds.push(model_group)
  gltfs.push(model_group)
  //console.log(builds.length)
}
