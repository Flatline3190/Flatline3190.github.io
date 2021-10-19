export function Article(resourceData) {
  //console.log(resourceData.name, resourceData.description)
  const articlePanel = document.getElementById('fPanel')
  const article = document.createElement('div')
  article.className = 'article'
  article.innerHTML = resourceData.name

  articlePanel.appendChild(article)
  const articletext = document.createElement('ul')
  articletext.className = 'articletext'

  const No = document.createElement('ul')
  No.className = 'ftext'
  No.innerHTML = 'No : ' + resourceData.No
  const Race = document.createElement('ul')
  Race.className = 'ftext'
  Race.innerHTML = 'Race : ' + resourceData.Race
  const Cattle_ID = document.createElement('ul')
  Cattle_ID.className = 'ftext'
  Cattle_ID.innerHTML = 'Cattle_ID : ' + resourceData.Cattle_ID
  const Gender = document.createElement('ul')
  Gender.className = 'ftext'
  Gender.innerHTML = 'Gender : ' + resourceData.Gender
  const Birth = document.createElement('ul')
  Birth.className = 'ftext'
  Birth.innerHTML = 'Birth : ' + resourceData.Birth
  const Age = document.createElement('ul')
  Age.className = 'ftext'
  Age.innerHTML = 'Age : ' + resourceData.Age
  const Dad_No = document.createElement('ul')
  Dad_No.className = 'ftext'
  Dad_No.innerHTML = 'Dad_No : ' + resourceData.Dad_No
  const Dad_NABB = document.createElement('ul')
  Dad_NABB.className = 'ftext'
  Dad_NABB.innerHTML = 'Dad_NABB : ' + resourceData.Dad_NABB
  const Mom_No = document.createElement('ul')
  Mom_No.className = 'ftext'
  Mom_No.innerHTML = 'Mom_No : ' + resourceData.Mom_No
  const State = document.createElement('ul')
  State.className = 'ftext'
  State.innerHTML = 'State : ' + resourceData.State
  const Owner = document.createElement('ul')
  Owner.className = 'ftext'
  Owner.innerHTML = 'Owner : ' + resourceData.Owner

  const hlink = document.createElement('a')
  hlink.className = 'flink'
  hlink.target = '_blank'
  hlink.innerHTML = '點擊網站進入'
  if (resourceData.site !== undefined) {
    hlink.href = resourceData.site
  } else {
    hlink.href = 'http://www.ce.nchu.edu.tw/'
  }

  article.appendChild(articletext)
  articletext.appendChild(No)
  articletext.appendChild(Race)
  articletext.appendChild(Cattle_ID)
  articletext.appendChild(Gender)
  articletext.appendChild(Birth)
  articletext.appendChild(Age)
  articletext.appendChild(Dad_No)
  articletext.appendChild(Dad_NABB)
  articletext.appendChild(Mom_No)
  articletext.appendChild(State)
  articletext.appendChild(Owner)
  articletext.appendChild(hlink)
  article.id = 'facility_' + resourceData.name
  console.log(article.id)
  article.style.display = 'none'
}
