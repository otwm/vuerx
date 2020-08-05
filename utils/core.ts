import { isEmpty, isNil } from 'ramda'

/**
 * isEmptyOrNil
 * @param value
 * @returns {*}
 */
export const isEmptyOrNil = (value: any) => isEmpty(value) || isNil(value)
