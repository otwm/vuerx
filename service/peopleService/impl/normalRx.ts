import axios from 'axios'
import { defer, from, of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
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
    return await validateAll([
      { name: 'first_name', rules: 'required', value: person.first_name },
      { name: 'last_name', rules: 'required', value: person.last_name },
      { name: 'email', rules: 'required|email', value: person.contact.email },
      { name: 'phone', rules: 'required|phone', value: person.contact.phone },
      { name: 'ip_address', rules: 'ip', value: person.ip_address },
    ])
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
      // switchMap(this.),
      switchMap(updatePerson)
    ).subscribe(observer)
  }
}

export default normalRx
