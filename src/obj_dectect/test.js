import * as THREE from 'three'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'

export function Element(id) {
  const iframe = document.createElement('iframe')
  iframe.className = 'mv'
  iframe.allow = 'autoplay'
  iframe.width = '1280'
  iframe.height = '720'
  iframe.frameborder = '1'
  iframe.aloow = 'accelerometer; autoplay=1; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
  iframe.src = ['https://www.youtube.com/embed/', id].join('')
  //iframe.src = 'https://drive.google.com/file/d/1qU-3WeA7PncH1CeB_Y2nNJGUlohtew0k/preview'

  //scene.add(backcolor)
  const object = new CSS3DObject(iframe)
  object.name = 'lilac'
  object.scale.x = 0.0025
  object.scale.y = 0.0025
  object.scale.z = 0.0025

  //scene.add(object2)
  return object
}
