import fastify from 'fastify'
import path from 'path'
import { fileURLToPath } from 'url' // пока не пон зачем, можно ведь вручную наверн
import fastifyStatic from '@fastify/static'
import view from '@fastify/view'
import pug from 'pug'
import fastifyPostgres from '@fastify/postgres'
import { loadEnvFile } from 'node:process';

const app = fastify()
const port = 3000

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

loadEnvFile(path.resolve(dirname, '../.env'));



await app.register(fastifyStatic, {
  root: dirname,
  // prefix: '/',
  // setHeaders: (res, path) => {
  //   if (path.endsWith('.js')) {
  //     res.setHeader('Content-Type', 'application/javascript');
  //   }
  // }
})

await app.register(view, { engine: { pug } })

await app.register(fastifyPostgres, {
  connectionString: process.env.CONNECTION_STRING
})

let users = []

app.get('/', (req, res) => {
  console.log('redirect!!')
  res.redirect('/users')
})

app.pg.query(
  'SELECT * from userdata',
  (err, result) => {
    if (result) {
      users = result.rows
      console.log(users)
    }
    else {
      console.log(err)
    }
  }
)

app.get('/users', (req, res) => {
  res.view('src/views/users/index', {users})
})

app.get('/users/create', (req, res) => {
  res.view('src/views/users/form')
});

app.get(`/users/:id`, (req, res) => {
  const user = users.find(u => u.id == req.params.id)
  if (!user) {
    return res.code(404).send('User not found')
  }
  else {
    res.view('src/views/users/show', {user})
  }
})  

app.get('/api', async (req, res) => {
    res.send('Succesfull')
})

app.post('/users', (req, res) => {
  const { username, email } = req.body;

  const userToCheck = users.find(user => username === user.username || email === user.email)
  if (userToCheck) {
    if (userToCheck.username === username) {
      console.log('This username already exists!')
      res.send('This username already exists!')
      return 'This username already exists!'
    }
    else {
      console.log('This email already exists!')
      res.send('This email already exists!')
      return 'This email already exists!'
    }
  }

  const newUser = {
    id: crypto.randomUUID(),
    username,
    email,
  };
console.log(`INSERT INTO userdata (id) VALUES (${newUser.id})`)
  app.pg.query(
    `INSERT INTO userdata (id, username, email) VALUES ('${newUser.id}', '${newUser.username}', '${newUser.email}')`, // сделать потом защиту от sql инъекций
    (err, result) => {
      console.log(err || result)
    }
  )

  console.log('!!!!!!', newUser)
  users.push(newUser);
  console.log(users[users.length-1])
  res.redirect('/users');
});

app.post('/users/update', async (req, res) => {
  const { username, email, id } = req.body;
  const userToCheck = users.find(user => user.id !== id && (user.username === username || user.email === email))
  if (userToCheck) {
    return userToCheck.username === username? res.send('This username already exists!') : res.send('This email already exists!')
  }
  const userToUpdate = users.find(user => user.id === id)
  userToUpdate.username = username
  userToUpdate.email = email
  await app.pg.query(`UPDATE userdata SET username = '${username}', email = '${email}' WHERE id = '${id}'`, // сделать потом защиту от sql инъекций
    (err, result) => {
      console.log(err || result)
    }
  )
  res.send('User succesfully updated!')
})

app.post('/users/delete', async (req, res) => {
  const {id} = req.body
  await app.pg.query(`DELETE FROM userdata WHERE id = '${id}'` // сделать потом защиту от sql инъекций
  )
  users = users.filter(user => user.id !== id)
  res.send('User successfully deleted!')
}) 

app.setNotFoundHandler((req, res) => {
  res.code(404).send('Page does not exist')
}) // Обработка 404

// app.get('/*', (req, res) => res.code(404).send('Страница не найдена')) // либо так можно 404 обрабатывать

console.log('=== МАРШРУТЫ ЗАРЕГИСТРИРОВАНЫ ===');
console.log(app.printRoutes());  // Покажет все маршруты

app.listen({ port }, () => {
  console.log(`Example app listening on port ${port}`)
})