export default class ResourceNotFound extends Error {
  constructor(public status = 404) {
    super()
  }
}
