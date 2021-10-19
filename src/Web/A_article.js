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
  console.log(article.id)
  article.style.display = 'none'
}
