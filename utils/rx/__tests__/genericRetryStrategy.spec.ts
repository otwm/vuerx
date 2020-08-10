import { Observable, of, throwError, timer } from 'rxjs'
import { catchError, map, mergeMap, retryWhen, tap } from 'rxjs/operators'
import MaxRetryException from '~/exceptions/MaxRetryException'
import { curry } from 'ramda'
import { TestScheduler } from 'rxjs/testing'

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

  test('retry n case', (done) => {
    const myTest = () => {
      // throw new Error('some-error')
      throw 'error'
    }

    const myObservable = (source$: Observable<number>) => source$.pipe(
      map(x => x * 10),
      // retryWhen(genericRetryStrategy()),
    )

    scheduler.run(({ cold, expectObservable }) => {
      const value = { a: 1, b: 2, c: 3 }
      const source$ = cold('-a--b-c-|', value)
      const expectedMarble = '-a--b-c-|'
      const expectedValues = { a: 10 , b: 20, c: 30 }

      const result$ = myObservable(source$)
      expectObservable(result$).toBe(expectedMarble, expectedValues)
    })
  })

  // test('retry n case', (done) => {
  //   const myTest = () => {
  //     throw 'some-error'
  //   }
  //   const genericRetryStrategy = (retryConfig: RetryConfig = defaultRetryConfig) =>
  //     (errors: Observable<any>): Observable<any> => {
  //     return errors.pipe(
  //       mergeMap((error, index) => {
  //         const { isThrow, duration, maxRetryAttempts } = retryConfig
  //         if (isThrow(error)) return throwError(error)
  //         if ((index + 1) === maxRetryAttempts) return throwError(new MaxRetryException(error))
  //         return timer(duration)
  //       })
  //     )
  //   }
  //   of([1 ,2, 3]).pipe(
  //     map(myTest),
  //     retryWhen(genericRetryStrategy())
  //   ).subscribe({
  //     next: () => 0,
  //     error: (error) => {
  //       console.log(error)
  //       done()
  //     }
  //   })
  // })
})

