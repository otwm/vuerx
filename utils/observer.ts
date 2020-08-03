const { error: printError, log } = console
const error = (err: any) => printError('error : ', err)

const complete = () => log('complete')

const observer = {
  error, complete
}

export default observer
