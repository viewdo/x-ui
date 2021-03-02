import jsonata from 'jsonata'
import { arrify } from '../../../../services/common/arrify'

export async function filterData(filterString: string, data: any) {
  const filter = jsonata(filterString)
  return arrify(filter.evaluate(data))
}
