import * as THREE from 'three'

export function vid(camera, scene, renderer, controls, pos) {
  let video
  video = document.getElementById('video')

  const texture = new THREE.VideoTexture(video)
  console.log(texture)
  const geometry = new THREE.PlaneGeometry(16, 9)
  const geo2 = geometry.clone()

  geo2.scale(0.225, 0.225, 0.225)
  const test = document.createElement('video')
  test.innerHTML = '<iframe src="https://drive.google.com/file/d/1qU-3WeA7PncH1CeB_Y2nNJGUlohtew0k/preview" width="640" height="480" allow="autoplay"></iframe>'
  console.log(test)
  const bgcolor = new THREE.MeshBasicMaterial({ color: 0xffff00 })
  bgcolor.side = THREE.DoubleSide
  const backcolor = new THREE.Mesh(geo2, bgcolor)
  backcolor.position.set(pos)
  backcolor.position.x = pos.x + 7.655
  backcolor.position.y = pos.y + 2.5
  backcolor.position.z = pos.z + 1.017
  var look = backcolor.position.clone()
  look.x = pos.x + 8.438
  look.y = pos.y + 2.5
  look.z = pos.z + 0.674
  backcolor.lookAt(look)

  geometry.scale(0.2, 0.2, 0.2)
  const material = new THREE.MeshBasicMaterial({ map: texture })
  //material.depthTest = false
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.x = pos.x + 7.655
  mesh.position.y = pos.y + 2.5
  mesh.position.z = pos.z + 1.017
  mesh.lookAt(look)

  //scene.add(backcolor)
  scene.add(mesh)

  //

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const constraints = {
      video: {
        width: 1280,
        height: 720,
        deviceId: {
          exact: 'aaa91fc738aa3fe9da89707d98a6c7a5c510b2d9ccf6b2f0c03376066d0364a8',
        },
      },
    }

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (stream) {
        // apply the stream to the video element used in the texture
        //const nstream = URL.createObjectURL('https://drive.google.com/file/d/1Ga6IjkcDk8xDpJKluEBeCF-GNRfxvQee/view')
        video.srcObject = stream
        video.play()
      })
      .catch(function (error) {
        console.error('Unable to access the camera/webcam.', error)
      })
  } else {
    console.error('MediaDevices interface not available.')
  }
}
