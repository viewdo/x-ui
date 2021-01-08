import { kebabToCamelCase } from './string-utils'

describe('kebabToCamelCase', () => {
  const camel = kebabToCamelCase('this-is-a-word')

  it('should translate', async () => {
    expect(camel).toBe('thisIsAWord')
  })
})
