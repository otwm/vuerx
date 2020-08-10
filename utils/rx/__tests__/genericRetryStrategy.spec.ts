import { Observable, of, throwError, timer } from 'rxjs'
import { map, mergeMap, retryWhen, tap } from 'rxjs/operators'
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
  test('retry n case', (done) => {
    const myTest = () => {
      throw 'some-error'
    }
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
    of([1 ,2, 3]).pipe(
      map(myTest),
      retryWhen(genericRetryStrategy())
    ).subscribe({
      next: () => 0,
      error: (error) => {
        console.log(error)
        done()
      }
    })
  })
})

