import '../addValidation'
import validateAll from '~/utils/validateAll'

describe('validationAll', () => {
  test('validationAll', async () => {
    const results = await validateAll([{
      name: 'mytest', rules: 'required|email', value: 'wrong!'
    }])
    expect(results.errors[0].errors[0]).toBe('mytest 항목의 값은 유효한 이메일 형식이어야 합니다')

    const result2 = await validateAll([{
      name: 'mytest', rules: 'required|email', value: 'abc@gmail.com'
    }])
    expect(result2.valid).toBe(true)
  })
})
