import { useEffect, useId, useRef, useState } from 'react'
import styles from './CustomSelect.module.css'

function CustomSelect({
  name,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  required = false,
  searchable = true,
  label,
}) {
  const listId = useId()
  const rootRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const normalizedOptions = options.map((option) => (
    typeof option === 'string' ? { value: option, label: option } : option
  ))

  const filtered = searchable && query
    ? normalizedOptions.filter((option) => (
      option.label.toLowerCase().includes(query.toLowerCase())
    ))
    : normalizedOptions

  const selected = normalizedOptions.find((option) => option.value === value)

  useEffect(() => {
    const handleClick = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false)
        setQuery('')
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const pick = (optionValue) => {
    onChange({ target: { name, value: optionValue } })
    setOpen(false)
    setQuery('')
  }

  return (
    <div className={styles.field} ref={rootRef}>
      {label && <span className={styles.label}>{label}</span>}
      <button
        type="button"
        className={`${styles.trigger} ${open ? styles.triggerOpen : ''} ${!value ? styles.placeholder : ''}`}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
      >
        <span>{selected?.label || placeholder}</span>
        <svg className={styles.chevron} viewBox="0 0 20 20" aria-hidden="true">
          <path d="M5 7l5 6 5-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
      <input type="hidden" name={name} value={value} required={required} readOnly />

      {open && (
        <div className={styles.panel} role="listbox" id={listId}>
          {searchable && (
            <div className={styles.searchWrap}>
              <input
                className={styles.search}
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                autoFocus
              />
            </div>
          )}
          <ul className={styles.list}>
            {filtered.length === 0 ? (
              <li className={styles.empty}>No matches found</li>
            ) : (
              filtered.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    className={`${styles.option} ${option.value === value ? styles.optionActive : ''}`}
                    onClick={() => pick(option.value)}
                    role="option"
                    aria-selected={option.value === value}
                  >
                    {option.label}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default CustomSelect
