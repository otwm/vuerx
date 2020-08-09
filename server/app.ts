import 'module-alias/register'
import express, { NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'
import people from './routes/people'

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use((_, res, next) => {
  console.log('server')
  next()
})

app.use('/people', people)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err)
  res.json({ err })
})
export default app
