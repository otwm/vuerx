import axios from 'axios'
import { defer, from, of, throwError, timer } from 'rxjs'
import { catchError, concatMap, debounce, delayWhen, map, retryWhen, switchMap, take, tap } from 'rxjs/operators'
import { Person } from '~/types'
import '~/utils/addValidation'
import validateAll from '~/utils/validateAll'
import genericRetryStrategy from '~/utils/rx/genericRetryStrategy'
import { searchPeople, updatePerson, ConvertedParam, retrievePeople } from '~/api/peopleApi'

interface Param {
  name: string;
  size: number;
}

const normalRx = {
  search (params: Param, observer: any) {
    const query2Param = (params: Param): ConvertedParam => {
      const { name, size } = params
      return { pname: name, psize: size }
    }
    of(params).pipe(
      map(query2Param),
      switchMap(searchPeople)
    ).subscribe(observer)
  },
  detail (id: number, observer: any) {
    from(retrievePeople(id)).subscribe(observer)
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
    of(person).pipe(
      debounce(() => timer(1000)),
      switchMap(this.validationPerson),
      switchMap(updatePerson),
      retryWhen(genericRetryStrategy()),
      catchError(e => e)
    ).subscribe(observer)
  }
}

export default normalRx
