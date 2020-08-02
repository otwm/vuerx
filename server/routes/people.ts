import { Router } from 'express'
import peopleData from '../../static/random-data.json'

const people = Router()

people.get('/', (req, res) => {
  // @ts-ignore
  const findName= ({ first_name, last_name }) => (`${first_name}${last_name}`).includes(req.query.name)
  // @ts-ignore
  res.json(peopleData.filter(findName).slice(0, 10))
})

people.get('/:id', (req, res) => {
  res.json(peopleData.find(({ id }) => id === Number(req.params.id)))
})

export default people
