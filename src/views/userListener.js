const userDiv = document.querySelector('div.user')
const main = document.querySelector('main')

const usernameSpan = document.querySelector('p.username > span')
let username = usernameSpan.textContent

const emailSpan = document.querySelector('p.email > span')
let email = emailSpan.textContent

const idSpan = document.querySelector('p.id > span')
const id = idSpan.textContent

const deleteUserButton = document.querySelector('button.delete')

const createUser = (username, email) => {
  const newUserDiv = document.createElement('div')
  newUserDiv.classList.add('user')

  const usernameParagraph = document.createElement('p')
  usernameParagraph.classList.add('username')
  usernameParagraph.textContent = 'Username: '
  const usernameSpan = document.createElement('span')
  usernameSpan.textContent = username
  usernameParagraph.appendChild(usernameSpan)

  const emailParagraph = document.createElement('p')
  emailParagraph.classList.add('email')
  emailParagraph.textContent = 'Email: '
  const emailSpan = document.createElement('span')
  emailSpan.textContent = email
  emailParagraph.appendChild(emailSpan)

  const idParagraph = document.createElement('p')
  idParagraph.classList.add('id')
  idParagraph.textContent = 'ID: '
  const idSpan = document.createElement('span')
  idSpan.textContent = id
  idParagraph.appendChild(idSpan)

  const deleteUserButton = document.createElement('button')
  deleteUserButton.classList.add('delete')
  deleteUserButton.textContent = 'Delete user'

  const allUsersButton = document.createElement('button')
  allUsersButton.textContent = 'Go to all users'
  allUsersButton.addEventListener('click', () => {
    window.location.href = '/users'
  })


  newUserDiv.appendChild(usernameParagraph)
  newUserDiv.appendChild(emailParagraph)
  newUserDiv.appendChild(idParagraph)
  newUserDiv.appendChild(deleteUserButton)
  newUserDiv.appendChild(allUsersButton)

  main.innerHTML = ''
  main.appendChild(newUserDiv)


  usernameSpan.addEventListener('click', () => {
    createForm(username, email, 'Username')
  })

  emailSpan.addEventListener('click', () => {
    createForm(username, email, 'Email')
  })


  deleteUserButton.addEventListener('click', async () => {
    const result = await axios.post('/users/delete', {id})
    if (result.data === 'User successfully deleted!') {
      const infoDiv = document.createElement('div')

      const h1Info = document.createElement('h1')
      h1Info.textContent = 'User successfully deleted!'
      const linkToUsersPage = document.createElement('a')
      linkToUsersPage.setAttribute('href', '/users')
      linkToUsersPage.textContent = 'Go to all users'

      infoDiv.appendChild(h1Info)
      infoDiv.appendChild(linkToUsersPage)

      main.innerHTML = ''
      main.appendChild(infoDiv)
    }
    else {
      const h2DeleteError = document.createElement('h2')
      h2DeleteError.textContent = 'An error occurred while deleting'
      main.prepend(h2DeleteError)
    }
  })
}

const createForm = (username, email, focusWindow) => {
  const form = document.createElement('form')
  const usernameDiv = document.createElement('div')
  usernameDiv.classList.add('username')
  const usernameLabel = document.createElement('label')
  usernameLabel.setAttribute('for', 'username')
  usernameLabel.textContent = 'Username'
  const usernameInput = document.createElement('input')
  usernameInput.setAttribute('type', 'text')
  usernameInput.setAttribute('id', 'username')
  usernameInput.setAttribute('name', 'username')
  usernameInput.setAttribute('required', 'true')
  usernameInput.value = username

  usernameDiv.appendChild(usernameLabel)
  usernameDiv.appendChild(usernameInput)


  const emailDiv = document.createElement('div')
  emailDiv.classList.add('email')
  const emailLabel = document.createElement('label')
  emailLabel.setAttribute('for', 'username')
  emailLabel.textContent = 'Email'
  const emailInput = document.createElement('input')
  emailInput.setAttribute('type', 'email')
  emailInput.setAttribute('id', 'email')
  emailInput.setAttribute('name', 'email')
  emailInput.setAttribute('required', 'true')
  emailInput.value = email

  emailDiv.appendChild(emailLabel)
  emailDiv.appendChild(emailInput)

  const buttonSubmit = document.createElement('button')
  buttonSubmit.setAttribute('type', 'submit')
  buttonSubmit.textContent = 'Change'

  const cancelButton = document.createElement('button')
  cancelButton.setAttribute('type', 'button')
  cancelButton.textContent = 'Cancel'

  form.appendChild(usernameDiv)
  form.appendChild(emailDiv)
  form.appendChild(buttonSubmit)
  form.appendChild(cancelButton)
  

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const result = await axios.post('/users/update', { ...Object.fromEntries(formData), id })
    const existsH1Error = document.querySelector('h1.error')
    console.log(existsH1Error)
    existsH1Error?.remove()
    if (result.data === 'This email already exists!' || result.data === 'This username already exists!') {
      const h1Error = document.createElement('h1')
      h1Error.classList.add('error')
      h1Error.textContent = result.data
      main.prepend(h1Error)
    }
    else {
      username = formData.get('username')
      email = formData.get('email')
      createUser(username, email)
    }
  })


  cancelButton.addEventListener('click', () => {
    createUser(username, email)
  })

  main.innerHTML = ''
  main.appendChild(form)

  if (focusWindow === 'Username') {
    usernameInput.focus()
  }
  else if (focusWindow === 'Email') {
    emailInput.focus()
  }
}


usernameSpan.addEventListener('click', () => {
  createForm(username, email, 'Username')
})

emailSpan.addEventListener('click', () => {
  createForm(username, email, 'Email')
})


deleteUserButton.addEventListener('click', async () => {
  const result = await axios.post('/users/delete', {id})
  if (result.data === 'User successfully deleted!') {
    const infoDiv = document.createElement('div')

    const h1Info = document.createElement('h1')
    h1Info.textContent = 'User successfully deleted!'
    const linkToUsersPage = document.createElement('a')
    linkToUsersPage.setAttribute('href', '/users')
    linkToUsersPage.textContent = 'Go to all users'

    infoDiv.appendChild(h1Info)
    infoDiv.appendChild(linkToUsersPage)

    main.innerHTML = ''
    main.appendChild(infoDiv)
  }
  else {
    const h2DeleteError = document.createElement('h2')
    h2DeleteError.textContent = 'An error occurred while deleting'
    main.prepend(h2DeleteError)
  }
})