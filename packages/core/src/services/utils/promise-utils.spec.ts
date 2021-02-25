import * as promise_utils from './promise-utils'
// @ponicode
describe('promise_utils.sleep', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })
  test('0', () => {
    promise_utils.sleep(100)
  })

  test('1', () => {
    promise_utils.sleep(1)
  })

  test('2', () => {
    promise_utils.sleep(0)
  })

  test('3', () => {
    promise_utils.sleep(NaN)
  })
})
