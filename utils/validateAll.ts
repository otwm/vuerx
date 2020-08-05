import { validate } from 'vee-validate'
import ko from 'vee-validate/dist/locale/ko.json'
import { isEmptyOrNil } from '~/utils/core'
import { pick } from 'ramda'

interface ValidationDef {
  name: string;
  fieldName?: string;
  rules: string;
  value: any;
}

const customMessages = ko.messages
const validateExecute = async ({ value, rules, name, fieldName }: ValidationDef) => {
  const result = await validate(value, rules, {
    name: (fieldName || name), customMessages
  })
  return { ...result, name }
}

const validateAll = async (validationDefs: ValidationDef[]) => {
  const results = await Promise.all(validationDefs.map(validateExecute))
  const valid = isEmptyOrNil(results.find(({ valid }) => !valid))
  const errorsWithName = results.map(pick(['errors', 'name']))
  const errors = results.map(pick(['errors']))
  return { results, valid, errorsWithName, errors }
}

export default validateAll
