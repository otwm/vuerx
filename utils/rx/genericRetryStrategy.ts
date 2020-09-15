import { Observable, throwError, timer } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import MaxRetryException from '~/exceptions/MaxRetryException'
import { curry } from 'ramda'

export interface RetryConfig {
  maxRetryAttempts: number;
  duration: number;
  isThrow: (errors: Observable<any>) => boolean;
}

export const isThrowByExceptStatus = (
  targetStatus: number[], error: any
) => {
  return !targetStatus.includes(error.status)
}

export const isThrowByExceptStatusDefault = curry(isThrowByExceptStatus)([
  503, 520
])

export const defaultRetryConfig = {
  maxRetryAttempts: 3,
  duration: 1000,
  isThrow: isThrowByExceptStatusDefault
}

const genericRetryStrategy = (retryConfig: RetryConfig = defaultRetryConfig) =>
  (errors: Observable<any>): Observable<any> => {
    return errors.pipe(
      mergeMap((error, index) => {
        const { isThrow, duration, maxRetryAttempts } = retryConfig
        if (isThrow(error)) return throwError(error)
        if ((index + 1) === maxRetryAttempts) {
          return throwError(new MaxRetryException(error))
        }
        console.log('duration', duration)
        return timer(duration)
      })
    )
  }

export default genericRetryStrategy
