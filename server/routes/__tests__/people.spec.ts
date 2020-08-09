import express from 'express'
import request from 'supertest'
import people from '../people'
import bodyParser from 'body-parser'
import { head } from 'ramda'

const Sebastien = {
  id: 1,
  first_name: 'Sebastien',
  last_name: 'Thorsby',
  contact: { email: 'sthorsby0@psu.edu', phone: '1-(208)492-2543' },
  gender: 'Male',
  ip_address: '250.213.72.156',
  avatar: 'https://robohash.org/quimodisint.png?size=200x200&set=set1',
  address: {
    city: 'Idaho Falls',
    country: 'United States',
    postalCode: '83405',
    state: 'ID',
    street: '9465 Utah Crossing'
  }
}

describe('people router', () => {
  const app = express()

  beforeAll(() => {
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use('/people', people)
  })

  test('search', async () => {
    const res = await request(app)
    .get('/people')
    .query({
      pname: 'Sebastien',
      psize: 10
    })

    expect(res.body.length).toBe(1)
    expect(res.body).toEqual([ Sebastien ])
  })

  test('update', async () => {
    const res = await request(app)
      .put('/people')
      .send({ ...Sebastien, last_name: 'kim'})
    expect(res.body).toEqual({ ...Sebastien, last_name: 'kim'})
    const res2 = await request(app)
      .get('/people')
      .query({
        pname: 'Sebastien',
        psize: 1
    })
    expect(head(res2.body)).toEqual({ ...Sebastien, last_name: 'kim'})
  })
})
