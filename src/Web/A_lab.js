import * as THREE from 'three'
const labPanel = document.getElementById('labPanel')

const getnames = new THREE.FileLoader()
getnames.setMimeType('json')

getnames.load('./lab_info.json', function (all) {
  const labs = JSON.parse(all)
  for (let i = 0; i < labs.length; i++) {
    const lab_web = document.createElement('div')
    labPanel.appendChild(lab_web)
    lab_web.className = 'lab_information'
    const alab = labs[i]
    const container = document.createElement('div')
    container.className = 'container'
    lab_web.appendChild(container)
    const closeb = document.createElement('button')
    closeb.innerText = '×'
    container.appendChild(closeb)

    closeb.className = 'closing'
    const contrl = document.getElementById('controlButton')
    contrl.addEventListener('click', function () {
      lab_web.style.display = 'block'
    })
    closeb.addEventListener('click', function () {
      lab_web.style.display = 'none'
    })
    const title = document.createElement('h1')

    title.className = 'title'
    container.appendChild(title)

    title.innerText = alab.Name
    const introduction = document.createElement('ul')
    introduction.className = 'intro'
    container.appendChild(introduction)
    const contenttitle = document.createElement('ul')
    contenttitle.className = 'content'
    container.appendChild(contenttitle)
    for (let i = 0; i < alab.Introduction.length; i++) {
      const intros = document.createElement('li')
      intros.className = 'introtext'
      intros.innerHTML = alab.Introduction[i].text
      introduction.appendChild(intros)
    }
    for (let i = 0; i < alab.ContentTitle.length; i++) {
      const content = document.createElement('li')
      content.className = 'contenttext'
      content.innerHTML = alab.ContentTitle[i].text
      contenttitle.appendChild(content)
    }
  }
})
