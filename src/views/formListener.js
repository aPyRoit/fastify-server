const form = document.querySelector('form')
const main = document.querySelector('main')
form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const formData = new FormData(e.target)
  console.log(formData)
  // console.log(typeof formData)
  // console.log(formData instanceof FormData)
  result = await axios.post('/users', Object.fromEntries(formData))
  if (result.data === 'This username already exists!' || result.data === 'This email already exists!') {
    const isH1Info = document.querySelector('h1.info')
    if (isH1Info) {
      isH1Info.remove()
    }
    const isH1Error = document.querySelector('h1.error')
      if (isH1Error) {
        if(isH1Error.textContent === result.data) {
          return
        }
        else isH1Error.remove()
      }
      const h1Error = document.createElement('h1')
      h1Error.classList.add('error')
      h1Error.textContent = result.data
      main.append(h1Error)
  }
  else {
    const isH1Error = document.querySelector('h1.error')
      if (isH1Error) {
        isH1Error.remove()
      } 
    const h1Info = document.createElement('h1')
    h1Info.classList.add('info')
    h1Info.textContent = 'User created successfully!'

    const linkToUsersPage = document.createElement('a')
    linkToUsersPage.setAttribute('href', '/users')
    linkToUsersPage.textContent = 'Go to all users'

    main.innerHTML = ''
    main.appendChild(h1Info)
    main.appendChild(linkToUsersPage)
  }
})