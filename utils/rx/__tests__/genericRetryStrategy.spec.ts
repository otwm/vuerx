import { TestScheduler } from 'rxjs/testing'
import { Observable } from 'rxjs'
import { map, retryWhen, tap } from 'rxjs/operators'
import MaxRetryException from '~/exceptions/MaxRetryException'
import InternalServerError from '~/exceptions/InternalServerError'
import genericRetryStrategy, { isThrowByExceptStatusDefault } from '~/utils/rx/genericRetryStrategy'

describe('genericRetryStrategy', () => {
  let scheduler: TestScheduler

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      return expect(actual).toEqual(expected)
    })
  })

  const myObservable = (source$: Observable<number>) => source$.pipe(
    map(n => n * 10),
    retryWhen(genericRetryStrategy())
  )

  test('direct throw', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const value = { a: 1, b: 2, c: 3 }
      const source$ = cold('-a--b-c-#', value)
      const expectedMarble = '-a--b-c-#'
      const expectedValues = { a: 10 , b: 20, c: 30 }

      const result$ = myObservable(source$)
      expectObservable(result$).toBe(expectedMarble, expectedValues)
    })
  })

  test('일반 적인 에러는 그냥 에러가 난다. 리트라이 없이 fail', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const value = { a: 1, b: 2, c: 3 }
      const source$ = cold('-a-#', value)
      const expectedMarble = '-a-#'
      const expectedValues = { a: 10 , b: 20, c: 30 }

      const retryObservable = (source$: Observable<number>) => source$.pipe(
        tap(console.log),
        map(n => n * 10),
        retryWhen(genericRetryStrategy({
          maxRetryAttempts: 2,
          duration: 3,
          isThrow: isThrowByExceptStatusDefault,
        }))
      )
      const result$ = retryObservable(source$)
      expectObservable(result$).toBe(expectedMarble, expectedValues)
    })
  })

  test('retry case. 4번의 재시도 끝에 실패한다.', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const value = { a: 1, b: 2, c: 3 }
      const source$ = cold('a-#', value, new InternalServerError())
      const expectedMarble = 'a--a--a--a-#'
      const expectedValues = { a: 10 , b: 20, c: 30 }
      const retryObservable = (source$: Observable<number>) => source$.pipe(
        tap(console.log),
        map(n => n * 10),
        retryWhen(genericRetryStrategy({
          maxRetryAttempts: 4,
          duration: 1,
          isThrow: isThrowByExceptStatusDefault,
        }))
      )
      const result$ = retryObservable(source$)
      expectObservable(result$).toBe(
        expectedMarble, expectedValues,
        new MaxRetryException(new InternalServerError())
      )
    })
  })
})
