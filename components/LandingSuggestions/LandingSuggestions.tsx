import { ComponentProps, useEffect, useState } from 'react'
import styles from './LandingSuggestions.module.css'

import { type Suggestion } from './types'
import { generateUsername } from 'unique-username-generator'

// Naive domain suggester
// Migrate to better server-side suggestion algorithm
const generateSuggestion = (): Suggestion => {
  return {
    domain: `${generateUsername()}.eth`,
    priceInUSD: 5 // TODO
  }
}

interface SuggestionTagProps extends ComponentProps<'div'> {
  suggestion: Suggestion
}

const SuggestionTag = ({ suggestion: { domain, priceInUSD }, ...props }: SuggestionTagProps) => {
  return (
    <div className={styles.suggestion} {...props}>
      {domain}
      <span>${priceInUSD}</span>
    </div>
  )
}

export interface LandingSuggestionsProps {
  onSuggestionSelected: (s: Suggestion) => void
}

export const LandingSuggestions = ({ onSuggestionSelected }: LandingSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])

  useEffect(() => {
    setSuggestions(
      Array(6)
        .fill(0)
        .map((_) => generateSuggestion())
    )
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.title}>Suggested for you</div>
      <div className={styles.suggestions}>
        {suggestions.map((item) => (
          <SuggestionTag
            key={item.domain}
            suggestion={item}
            onClick={() => onSuggestionSelected(item)}
          />
        ))}
      </div>
    </div>
  )
}
