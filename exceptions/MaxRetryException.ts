export default class MaxRetryException extends Error {
  constructor(private readonly error: Error) {
    super()
  }
}
