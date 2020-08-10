import axios from 'axios'
import { defer, from, of, throwError, timer } from 'rxjs'
import { catchError, concatMap, debounce, delayWhen, map, retryWhen, switchMap, take, tap } from 'rxjs/operators'
import { Person } from '~/types'
import '~/utils/addValidation'
import validateAll from '~/utils/validateAll'

interface Param {
  name: string;
  size: number;
}

interface ConvertedParam {
  pname: string;
  psize: number;
}

const normalRx = {
  search (params: Param, observer: any) {
    const query2Param = (params: Param): ConvertedParam => {
      const { name, size } = params
      return { pname: name, psize: size }
    }
    const send = async (params: ConvertedParam) => {
      const res = await axios.request({
        url: '/server/people',
        params
      })
      return res.data
    }
    of(params).pipe(
      map(query2Param),
      switchMap(send)
    ).subscribe(observer)
  },
  detail (id: number, observer: any) {
    const send = async (id: number) => {
      const res = await axios({
        url: `/server/people/${id}`,
      })
      return res.data
    }
    from(send(id)).subscribe(observer)
  },
  insert (person: Person, observer: any) {

  },
  async validationPerson (person: Person) {
    const result = await validateAll([
      { name: 'first_name', rules: 'required', value: person.first_name },
      { name: 'last_name', rules: 'required', value: person.last_name },
      { name: 'email', rules: 'required|email', value: person.contact.email },
      { name: 'phone', rules: 'required|phone', value: person.contact.phone },
      { name: 'ip_address', rules: 'ip', value: person.ip_address },
    ])
    if (result.valid) {
      return person
    } else {
      throw result
    }
  },
  update (person: Person, observer: any) {
    const updatePerson = async (person: Person) => {
      const res = await axios.request({
        url: '/server/people',
        method: 'put',
        data: person
      })
      return res.data
    }
    of(person).pipe(
      debounce(() => timer(1000)),
      switchMap(this.validationPerson),
      switchMap(updatePerson),
      retryWhen(errors => {
        return errors.pipe(
          delayWhen(() => timer(1000)),
          tap(() => console.log('retry...')),
          take(3),
          // concatMap(throwError)
        )
      }),
      catchError(e => {
        console.log('eeeee')
        return of([])
      })
    ).subscribe(observer)
  }
}

export default normalRx
