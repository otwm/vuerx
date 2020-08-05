import { validate } from 'vee-validate'
import ko from 'vee-validate/dist/locale/ko.json'
import { isEmptyOrNil } from '~/utils/core'
import { pick } from 'ramda'
import type { ValidationResult } from 'vee-validate/dist/types/types'

export interface ValidationDef {
  name: string;
  fieldName?: string;
  rules: string;
  value: any;
}

export interface AllValidationResult {
  results: ValidationResultWithName[];
  valid: boolean;
  errorsWithName: { errors: string[], name: string }[];
  errors: { errors: string[]}[];
}

export type ValidationResultWithName = ValidationResult & { name: string }

const customMessages = ko.messages
const validateExecute = async ({ value, rules, name, fieldName }: ValidationDef): Promise<ValidationResultWithName> => {
  const result = await validate(value, rules, {
    name: (fieldName || name), customMessages
  })
  return { ...result, name }
}

const validateAll = async (validationDefs: ValidationDef[]): Promise<AllValidationResult> => {
  const results: ValidationResultWithName[] = await Promise.all(validationDefs.map(validateExecute))
  const valid = isEmptyOrNil(results.find(({ valid }) => !valid))
  const errorsWithName = results.map(pick(['errors', 'name']))
  const errors = results.map(pick(['errors']))
  return { results, valid, errorsWithName, errors }
}

export default validateAll
