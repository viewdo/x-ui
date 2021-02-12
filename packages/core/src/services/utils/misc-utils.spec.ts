import { debounce } from './misc-utils'
import { sleep } from './promise-utils'

describe('misc_utils.debounce', () => {
  test('executes correctly', () => {
    let result = false
    const func = () => {
      result = true
    }
    const subject = debounce(300, func, true)
    subject()
    sleep(300)

    expect(result)
  })

  test('executes only once given many sequential executions', () => {
    const results: boolean[] = []
    const subject = debounce(
      1000,
      () => {
        results.push(true)
      },
      false,
    )
    subject()
    subject()
    subject()
    subject()

    expect(results.length).toBe(1)
  })
})
