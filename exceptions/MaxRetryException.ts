export default class MaxRetryException extends Error {
  constructor(public readonly error: Error) {
    super()
  }
}
