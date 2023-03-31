const DICT = {
  name: { singular: 'name', plural: 'names' },
  domain: {
    singular: 'domain',
    plural: 'domains'
  },
  day: {
    singular: 'day',
    plural: 'days'
  },
  year: {
    singular: 'year',
    plural: 'years'
  }
} as const

// When it becomes to hard to maintain this, replace the implementation
// with https://www.npmjs.com/package/pluralize
export function pluralize(
  word: keyof typeof DICT,
  count: number,
  onlyWord: boolean = false
): string {
  const pluralized = count > 1 ? DICT[word].plural : DICT[word].singular

  return onlyWord ? pluralized : [count, pluralized].join(' ')
}
