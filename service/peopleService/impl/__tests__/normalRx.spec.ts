import { extend } from 'vee-validate'
import validateAll from '~/utils/validateAll'
import * as rules from 'vee-validate/dist/rules'

for (let [rule, validation] of Object.entries(rules)) {
  extend(rule, {
    ...validation,
  });
}

extend('phone', {
  validate(value) {
    const phoneFormat = /^([0-9]|-|\(|\))*/
    return phoneFormat.test(value)
  },
  message: 'Wrong phone number!'
});

extend('ip', {
  validate(value) {
    const ipFormat = /^[0-9]*\.[0-9]*\.[0-9]*\.[0-9]*/
    return ipFormat.test(value)
  },
  message: 'Wrong phone number!'
});

const validationPerson = async () => {
  return await validateAll([
    { name: 'first_name', rules: 'required', value: Sebastien.first_name },
    { name: 'last_name', rules: 'required', value: Sebastien.last_name },
    { name: 'email', rules: 'required|email', value: Sebastien.contact.email },
    { name: 'phone', rules: 'required|phone', value: Sebastien.contact.phone },
    { name: 'ip_address', rules: 'ip', value: Sebastien.ip_address },
  ])
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
describe('normalRx', () => {
  test('validation', async () => {
    const result = await validationPerson()
    expect(result.valid).toBe(true)
  })
})
