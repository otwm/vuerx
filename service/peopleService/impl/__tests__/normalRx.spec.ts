import axios from 'axios'
import { Person } from '~/types'
import observer from '~/utils/observer'
import normalRx from '~/service/peopleService'

const { error: printError } = console

const next = jest.fn(x => {
  console.log('x: ', x)
  return x
})

const testObserver = {
  ...observer, next,
}

const Sebastien = {
  'id': 1,
  'first_name': 'Sebastien',
  'last_name': 'Thorsby',
  'contact': { 'email': 'sthorsby0@psu.edu', 'phone': '1-(208)492-2543' },
  'gender': 'Male',
  'ip_address': '250.213.72.156',
  'avatar': 'https://robohash.org/quimodisint.png?size=200x200&set=set1',
  'address': {
    'city': 'Idaho Falls',
    'country': 'United States',
    'postalCode': '83405',
    'state': 'ID',
    'street': '9465 Utah Crossing'
  }
}

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('normalRx', () => {
  test('search',  (done) => {
    const resp = { data: Sebastien }
    mockedAxios.request.mockResolvedValue(resp)
    normalRx.search({ name: 'Sebastien', size: 1 }, {
      ...observer, next: (person: Person) => {
        expect(person).toEqual(Sebastien)
        done()
      },
    })
  })

  test('validation ok', async () => {
    const newSebastien = { ...Sebastien, last_name: 'kim'}
    const result = await normalRx.validationPerson(newSebastien)
    expect(result.valid).toBe(true)
  })

  test('validation fail', async () => {
    const newSebastien: Person = {
      ...Sebastien,
      contact: { email: 'wrong email!', phone: 'wrong phone' },
      ip_address: 'wrong ip',
    }
    const result = await normalRx.validationPerson(newSebastien)
    console.log(result)
    expect(result.valid).toBe(false)
  })

  test('update', done => {
    const newSebastien = { ...Sebastien, last_name: 'kim'}
    const resp = { data: { ...Sebastien, last_name: 'kim'} }
    mockedAxios.request.mockResolvedValue(resp)

    normalRx.update(newSebastien, {
      ...observer, next: (person: Person) => {
        expect(person).toEqual(newSebastien)
        done()
      },
    })
  })
})
