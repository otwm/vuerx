import axios from 'axios'
import { of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'

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
  detail (id: number) {

  }
}

export default normalRx
