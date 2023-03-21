import React, { ChangeEvent } from 'react'
import styles from './Checkbox.module.css'
import { Checkbox as CheckboxIcon } from 'components/icons'

interface CheckboxProps {
  checked?: boolean
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

const Checkbox: React.FC<CheckboxProps> = ({ checked = false, onChange, disabled = false }) => {
  return (
    <div className={styles.checkbox}>
      <input
        className={styles.input}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      {checked && (
        <div className={styles.icon}>
          <CheckboxIcon />
        </div>
      )}
    </div>
  )
}

export default Checkbox
