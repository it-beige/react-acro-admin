import { RemoveSensitiveInterceptor } from '../remove-sensitive.interceptor'
describe('remove-sensitive-info.interceptor', () => {
  it('remove sensitve should run', () => {
    const re = new RemoveSensitiveInterceptor(['a'])
    const ignoredKeys = new Set(re.ignoredFields)
    const ignore = (key: string) => ignoredKeys.has(key)
    expect(re.removeFields({ b: 1 }, ignore)).toEqual({ b: 1 })
    expect(re.removeFields({ a: 1, b: 2 }, ignore)).toEqual({ b: 2 })
    expect(
      re.removeFields(
        {
          b: {
            a: 1,
          },
        },
        ignore,
      ),
    ).toEqual({ b: {} })

    expect(
      re.removeFields(
        {
          b: {
            a: 1,
          },
        },
        ignore,
      ),
    ).toEqual({ b: {} })

    expect(
      re.removeFields(
        {
          b: {
            a: {
              c: 1,
            },
          },
        },
        ignore,
      ),
    ).toEqual({ b: {} })

    expect(
      re.removeFields(
        {
          b: {
            c: {
              a: 1,
            },
          },
          a: 2,
        },
        ignore,
      ),
    ).toEqual({ b: { c: {} } })
  })
})
