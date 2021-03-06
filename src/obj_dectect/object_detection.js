import React from 'react'
import ReactDOM from 'react-dom'
import '/src/styles.css'
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import '@tensorflow/tfjs'

class Detect extends React.Component {
  componentDidMount() {
    const video = document.getElementById('video')
    video.style.height = window.innerHeight * 0.5
    video.style.width = window.innerHeight * 0.888
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const webCamPromise = navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            width: 696,
            height: 392,
            deviceId: { exact: '9097109244cf47f3e294956003771952d0df08dbe3b612b4bebf6f3996b81769' },
          },
        })
        .then((stream) => {
          video.srcObject = stream
          return new Promise((resolve, reject) => {
            video.onloadedmetadata = () => {
              video.play()
              resolve()
            }
          })
        })
      const modelPromise = cocoSsd.load()

      Promise.all([modelPromise, webCamPromise]).then((values) => {
        this.detectFrame(video, values[0])
      })
    }
  }

  detectFrame = (video, model) => {
    model.detect(video).then((predictions) => {
      this.renderPredictions(predictions)
      requestAnimationFrame(() => {
        this.detectFrame(video, model)
      })
    })
  }

  renderPredictions = (predictions) => {
    const c = document.getElementById('canvas')

    const ctx = c.getContext('2d')
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    // Font options.
    const font = '16px sans-serif'
    ctx.font = font
    ctx.textBaseline = 'top'
    predictions.forEach((prediction) => {
      const x = prediction.bbox[0]
      const y = prediction.bbox[1]
      const width = prediction.bbox[2]
      const height = prediction.bbox[3]
      // Draw the bounding box.
      ctx.strokeStyle = '#00FFFF'
      ctx.lineWidth = 4
      ctx.strokeRect(x, y, width, height)
      // Draw the label background.
      ctx.fillStyle = '#00FFFF'
      const textWidth = ctx.measureText(prediction.class).width
      const textHeight = parseInt(font, 10) // base 10
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4)
    })

    predictions.forEach((prediction) => {
      const x = prediction.bbox[0]
      const y = prediction.bbox[1]
      // Draw the text last to ensure it's on top.
      ctx.fillStyle = '#000000'
      ctx.fillText(prediction.class, x, y)
    })
  }

  render() {
    return (
      <div>
        <video muted id="video" width="696px" height="392px" />
        <canvas id="canvas" width="696px" height="392px" />
      </div>
    )
  }
}

const objElement = document.getElementById('obj_detect')

ReactDOM.render(<Detect />, objElement)
