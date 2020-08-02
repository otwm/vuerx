import { Router } from 'express'
import peopleData from '../../static/random-data.json'

const people = Router()

people.get('/', (req, res) => {
  res.json(peopleData)
})

people.get('/:id', (req, res) => {
  res.json(peopleData.find(({ id }) => id === Number(req.params.id)))
})

export default people
