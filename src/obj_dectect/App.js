import * as THREE from 'three'
import React from 'react'

const root = document.getElementById('root')
var labPanel = document.getElementById('temp')

const getnames = new THREE.FileLoader()
getnames.setMimeType('json')

export class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { inView: false }
    this.toAnimate = React.createRef()
  }

  // Check if part of the object is in the viewport
  handleScroll = (e) => {
    const aaa = document.getElementsByClassName('animate-me')
    const scrollTop = e.target.scrollTop
    const scrollBottom = scrollTop + window.innerHeight
    //console.log(aaa.length)
    const labs = document.getElementsByClassName('lab_information')

    for (let i = 0; i < aaa.length; i++) {
      //console.log(aaa[i].className)
      const elementTop = aaa[i].offsetTop
      const elementBottom = elementTop + aaa[i].clientHeight

      //console.log(scrollTop, scrollBottom, elementTop, elementBottom);
      //console.log(elementBottom - scrollBottom);
      //console.log(elementTop - scrollTop);
      const inView = scrollBottom > elementTop + aaa[i].clientHeight * 0.25 && !(scrollTop > elementBottom - aaa[i].clientHeight * 0.25)
      const animate = inView ? 'animate' : ''
      aaa[i].className = `animate-me ${animate}`
    }
  }

  // Create and remove event listeners for scrolling
  componentDidMount() {
    getnames.load('./lab_info.json', function (all) {
      const mains = document.getElementsByClassName('animate-me')
      console.log(mains)

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
        contenttitle.className = 'contents'
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
        mains[i].appendChild(lab_web)
      }
    })
    root.addEventListener('scroll', this.handleScroll, true)
  }
  componentWillUnmount() {
    root.removeEventListener('scroll', this.handleScroll)
  }

  render() {
    // This will apply the classname if the object is in the viewport

    return (
      <div className="app">
        <div id="main" className="main-content" ref={this.toAnimate}>
          <div class="animate-me"></div>
          <div class="animate-me"></div>
          <div class="animate-me"></div>
          <div class="animate-me"></div>
          <div class="animate-me"></div>
          <div class="animate-me"></div>
          <div class="animate-me"></div>
          <div class="animate-me"></div>
          <div class="animate-me"></div>
          <div class="animate-me"></div>
          <div class="animate-me"></div>
          <div class="animate-me"></div>
        </div>
      </div>
    )
  }
}
