import * as THREE from 'three'

export function vid2(camera, scene, renderer, controls, pos) {
  const geometry = new THREE.PlaneGeometry(16, 9)
  const video = document.getElementById('video2')

  const iframe = document.createElement('iframe')
  iframe.src = 'https://drive.google.com/file/d/1qU-3WeA7PncH1CeB_Y2nNJGUlohtew0k/preview'
  iframe.width = '640'
  iframe.height = '480'
  iframe.allow = 'autoplay'

  console.log(iframe)
  console.log(video)
  geometry.scale(0.2, 0.2, 0.2)
  const texture = new THREE.VideoTexture(video)
  const material = new THREE.MeshBasicMaterial({ map: texture })
  //material.depthTest = false
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.x = pos.x + 7.655
  mesh.position.y = pos.y + 2.5
  mesh.position.z = pos.z + 1.017

  var look = mesh.position.clone()
  look.x = pos.x + 8.438
  look.y = pos.y + 2.5
  look.z = pos.z + 0.674
  mesh.lookAt(look)

  //scene.add(backcolor)
  scene.add(mesh)

  //

  navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: { width: 1280, height: 720 },
    })
    .then((stream) => {
      video.srcObject = iframe.captureStream(60)
      video.play()
    })
    .catch(function (error) {
      console.error('Unable to access the camera/webcam.', error)
    })
}
