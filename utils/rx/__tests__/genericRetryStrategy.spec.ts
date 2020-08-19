import { TestScheduler } from 'rxjs/testing'
import { Observable, throwError, timer } from 'rxjs'
import { catchError, map, mergeMap, retryWhen, tap } from 'rxjs/operators'
import MaxRetryException from '~/exceptions/MaxRetryException'
import { curry } from 'ramda'

interface RetryConfig {
  maxRetryAttempts: number;
  duration: number;
  isThrow: (errors: Observable<any>) => boolean;
}

const isThrowByStatus = (
  targetStatus: number[], error: any
) => !targetStatus.includes(error.status)

const isThrowByStatusDefault = curry(isThrowByStatus)([
  503, 520
])

const defaultRetryConfig = {
  maxRetryAttempts: 3,
  duration: 1000,
  isThrow: isThrowByStatusDefault
}

describe('genericRetryStrategy', () => {
  let scheduler: TestScheduler

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      // console.log('compare: ',actual, expected)
      return expect(actual).toEqual(expected)
    })
  })

  const genericRetryStrategy = (retryConfig: RetryConfig = defaultRetryConfig) =>
    (errors: Observable<any>): Observable<any> => {
      return errors.pipe(
        mergeMap((error, index) => {
          const { isThrow, duration, maxRetryAttempts } = retryConfig
          if (isThrow(error)) return throwError(error)
          if ((index + 1) === maxRetryAttempts) return throwError(new MaxRetryException(error))
          return timer(duration)
        })
      )
    }

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

  test('retry case', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const value = { a: 1, b: 2, c: 3 }
      const source$ = cold('-a--b-c-#', value)
      const expectedMarble = '-a--b-c-#'
      const expectedValues = { a: 10 , b: 20, c: 30 }

      const retryObservable = (source$: Observable<number>) => source$.pipe(
        tap(console.log),
        map(n => n * 10),
        catchError((error) => {
          console.log(error)
          return throwError({ status: 503 })
        }),
        retryWhen(genericRetryStrategy({
          maxRetryAttempts: 2,
          duration: 3,
          isThrow: isThrowByStatusDefault,
        }))
      )
      const result$ = retryObservable(source$)
      expectObservable(result$).toBe(expectedMarble, expectedValues)
    })
  })
})
