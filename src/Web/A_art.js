const backstate = []
const hidestate = []

const closestate = []
const picstate = []

const backButton = document.getElementById('backButton')
const closeButton = document.getElementById('closeButton')
const hideButton = document.getElementById('hideButton')
const picshow = document.getElementById('picshow')

backstate.push(backButton)
closestate.push(closeButton)
hidestate.push(hideButton)
picstate.push(picshow)

export function Article(resourceData) {
  //console.log(resourceData.name, resourceData.description)
  const articlePanel = document.getElementById('articlePanel')
  articlePanel.className = 'articlePanel'
  const article = document.createElement('div')
  article.className = 'article'
  article.innerHTML = resourceData.name

  articlePanel.appendChild(article)
  const articletext = document.createElement('ul')
  articletext.className = 'articletext'
  articletext.innerHTML = resourceData.description
  const hlink = document.createElement('a')
  hlink.className = 'articlelink'
  hlink.target = '_blank'
  hlink.innerHTML = '點擊網站進入'
  if (resourceData.site !== undefined) {
    hlink.href = resourceData.site
  } else {
    hlink.href = 'http://www.ce.nchu.edu.tw/'
  }

  article.appendChild(articletext)
  articletext.appendChild(hlink)
  article.id = resourceData.name
  article.style.display = 'none'
  if (resourceData.name === '--牛舍') {
    const demo = document.createElement('div')
    demo.id = 'od'
    demo.className = 'od'
    const cam = document.createElement('div')
    cam.className = 'obj_detect'
    const scrpt = document.createElement('script')
    scrpt.type = 'module'
    scrpt.src = './src/obj_detect/object_detection.js'
    cam.appendChild(scrpt)

    demo.appendChild(cam)
    document.getElementById('od').style.zIndex = 5
    document.getElementById('od').style.display = 'none'
  }
}
