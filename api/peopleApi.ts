import { Person } from '~/types'
import axios from 'axios'

export interface ConvertedParam {
  pname: string;
  psize: number;
}

export const updatePerson = async (person: Person) => {
  const res = await axios.request({
    url: '/server/people',
    method: 'put',
    data: person
  })
  return res.data
}

export const searchPeople = async (params: ConvertedParam) => {
  const res = await axios.request({
    url: '/server/people',
    params
  })
  return res.data
}

export const retrievePeople = async (id: number) => {
  const res = await axios({
    url: `/server/people/${id}`,
  })
  return res.data
}
