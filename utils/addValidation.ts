import * as rules from 'vee-validate/dist/rules'
import { extend } from 'vee-validate'

for (let [rule, validation] of Object.entries(rules)) {
  extend(rule, {
    ...validation,
  });
}


extend('phone', {
  validate(value) {
    const phoneFormat = /^([0-9]|-|\(|\))*$/
    return phoneFormat.test(value)
  },
  message: 'Wrong phone number!'
});

extend('ip', {
  validate(value) {
    const ipFormat = /^[0-9]*\.[0-9]*\.[0-9]*\.[0-9]*$/
    return ipFormat.test(value)
  },
  message: 'Wrong ip number!'
});
