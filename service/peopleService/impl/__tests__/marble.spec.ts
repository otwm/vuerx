import { TestScheduler } from 'rxjs/testing'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

describe('Marble sample', () => {
  let scheduler: TestScheduler

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      // console.log('compare: ',actual, expected)
      return expect(actual).toEqual(expected)
    })
  })

  const myObservable = (source$: Observable<number>) => source$.pipe(
    map(n => n * 10)
  )


  test('first marble', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const value = { a: 1, b: 2, c: 3 }
      const source$ = cold('-a--b-c-|', value)
      const expectedMarble = '-a--b-c-|'
      const expectedValues = { a: 10 , b: 20, c: 30 }

      const result$ = myObservable(source$)
      expectObservable(result$).toBe(expectedMarble, expectedValues)
    })
  })
})
