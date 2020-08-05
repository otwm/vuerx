import PeopleRepo from '../PeopleRepo'

const { log } = console

describe('PeopleRepo', () => {
  let peopleRepo: any = null
  beforeAll(() => {
    peopleRepo = new PeopleRepo()
  })
  test('[detail]must cloned object', () => {
    const Sebastien = peopleRepo.findById(1)
    Sebastien!.first_name = 'dong o'
    const newSebastien = peopleRepo.findById(1)
    expect(newSebastien!.first_name).toBe('Sebastien')
  })

  test('[list]must cloned object', () => {
    const list = peopleRepo.list('Sebastien')
    const Sebastien = list[0]
    Sebastien!.first_name = 'dong o'
    const newSebastien = peopleRepo.list('Sebastien')[0]
    expect(newSebastien!.first_name).toBe('Sebastien')
  })

  test('update', () => {
    const Sebastien = peopleRepo.findById(1)
    peopleRepo.update({ ...Sebastien, first_name: 'dong o' })
    const newSebastien = peopleRepo.findById(1)
    expect(newSebastien.first_name).toBe('dong o')
  })

  test('remove', () => {
    peopleRepo.remove(1)
    expect(peopleRepo.findById(1)).toBeNull()
  })
})
