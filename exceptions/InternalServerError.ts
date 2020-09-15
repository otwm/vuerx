export default class InternalServerError extends Error {
  constructor(public status = 503) {
    super()
  }
}
