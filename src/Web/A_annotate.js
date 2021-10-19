import * as THREE from 'three'

const annotationMarkers = []
const infoMarkers = []

const circleTexture = new THREE.TextureLoader().load('img/circle.png')
//

const annotationsPanel = document.getElementById('annotationsPanel')
const ul = document.createElement('UL')
const ulElem = annotationsPanel.appendChild(ul)

export function Annotate(scene, annotations, a) {
  const li = document.createElement('UL')
  const liElem = ulElem.appendChild(li)
  const button = document.createElement('BUTTON')

  //button.innerHTML = a + " : " + annotations[a].name;
  button.innerHTML = a + ': ' + annotations[a].name

  ////console.log.log(annotations[a].name);
  button.className = 'annotationButton'
  //button.addEventListener("click", function () { gotoAnnotation(annotations[a]); });
  button.userData = annotations[a].name + '_'
  liElem.appendChild(button)
  const annotationSpriteMaterial = new THREE.SpriteMaterial({
    map: circleTexture,
    depthTest: false,
    depthWrite: false,
    sizeAttenuation: false,
  })
  const annotationSprite = new THREE.Sprite(annotationSpriteMaterial)
  annotationSprite.scale.set(0.05, 0.05, 0.05)
  annotationSprite.position.copy(annotations[a].position)
  annotationSprite.position.y = annotations[a].position.y + 3
  annotationSprite.userData.id = a
  annotationSprite.visible = false
  ////console.log.log(annotationSprite.id)
  scene.add(annotationSprite)
  annotationMarkers.push(annotationSprite)
  infoMarkers.push(annotationSprite)
  //

  const annotationDiv = document.createElement('div')
  annotationDiv.className = 'annotationLabel'
  return [button, annotationDiv]
}
