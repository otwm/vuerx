import { Router } from 'express'
import { peopleRepo } from '../repository'

const people = Router()

people.get('/', (req, res) => {
  if (req.query.pname === 'error') {
    throw new Error('wtf!')
  }
  const people = peopleRepo.list(req!.query!.pname as string)
  res.json(people!.slice(0, Number(req.query.psize)))
})

people.get('/:id', (req, res) => {
  const person = peopleRepo.findById(Number(req!.params!.id))
  res.json(person)
})

people.put('/', (req, res) => {
  if (req.query.pname === 'error') {
    throw new Error('wtf!')
  }
  const person = peopleRepo.update(req.body)
  res.json(person)
})

export default people
