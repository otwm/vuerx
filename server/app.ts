import express from 'express'
import people from './routes/people'

const app = express()
app.use((_, res, next) => {
  console.log('server')
  next()
})

app.use('/people', people)

export default app
