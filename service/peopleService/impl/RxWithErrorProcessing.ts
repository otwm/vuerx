import axios from 'axios'
import { of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { Person } from '~/types'

interface Param {
  name: string;
  size: number;
}

interface ConvertedParam {
  pname: string;
  psize: number;
}

const RxWithErrorProcessing = {
  /**
   * replace 전략
   * @param params
   * @param observer
   */
  search (params: Param, observer: any) {
    const query2Param = (params: Param): ConvertedParam => {
      const { name, size } = params
      return { pname: name, psize: size }
    }
    const send = async (params: ConvertedParam) => {
      const res = await axios({
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
  /**
   * retry throw
   * 3 retry
   * and throw
   * @param id
   */
  detail (id: number) {

  },
  /**
   * retry replace
   * 3 retry
   * and replace
   */
  insert (person: Person) {

  }
}

export default RxWithErrorProcessing
