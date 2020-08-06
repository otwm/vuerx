import { Person } from '../../types'
import peopleData from '../../static/random-data.json'
import { clone, isEmpty, isNil, toUpper } from 'ramda'

// const compareName = ({ first_name, last_name }: Person) => (`${toUpper(first_name + last_name)}`).includes(toUpper(name!))
export default class PeopleRepo {
  private people: Person[] = peopleData

  add (person: Person) {
    this.people = [ ...this.people, person]
  }

  list (name: string | undefined) {
    if (isEmpty(name)) return this.people
    return clone(this.people.filter(({ first_name, last_name }) => (`${first_name}${last_name}`).includes(name!)))
  }

  findById (_id: number) {
    const found = this.people.find(({ id }) => id === _id)
    if (isNil(found)) return null
    return clone(found)
  }

  findByName (name: string) {
    return this.people.find(({ first_name, last_name }) => (`${first_name}${last_name}`).includes(name))
  }

  remove (_id: number) {
    const start = this.people.findIndex(({ id }) => id === _id)
    this.people.splice(start, 1)
  }

  update (person: Person) {
    const start = this.people.findIndex(({ id }) => id === person.id)
    this.people.splice(start, 1, person)
  }
}
