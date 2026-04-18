import fastify from 'fastify'
import path from 'path'
import { fileURLToPath } from 'url'
import fastifyStatic from '@fastify/static'
import view from '@fastify/view'
import pug from 'pug'
import users from './users.js'
import formbody from '@fastify/formbody';

const app = fastify()
const port = 3000

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
await app.register(fastifyStatic, {
  root: dirname,
})

await app.register(formbody);

console.log(users)

await app.register(view, { engine: { pug } })

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

app.get('/api', (req, res) => {
    res.send('Запрос прошел успешно')
})

app.post('/users', (req, res) => {
  const { username, email } = req.body;
  
  const newUser = {
    id: crypto.randomUUID(),
    username,
    email,
  };
  
  users.push(newUser);
  res.redirect('/users');
});

console.log('=== МАРШРУТЫ ЗАРЕГИСТРИРОВАНЫ ===');
console.log(app.printRoutes());  // Покажет все маршруты

app.listen({ port }, () => {
  console.log(`Example app listening on port ${port}`)
})