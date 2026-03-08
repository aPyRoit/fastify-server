import fastify from 'fastify'
import path from 'path'
import { fileURLToPath } from 'url'
import fastifyStatic from '@fastify/static'

const app = fastify()
const port = 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.register(fastifyStatic, {
  root: __dirname,
})

app.get('/', (req, res) => {
    res.sendFile('index.html')
})

app.get('/api', (req, res) => {
    res.send('Запрос прошел успешно')
})

app.listen({ port }, () => {
  console.log(`Example app listening on port ${port}`)
})