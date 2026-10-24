'use client';
import React, { useId } from 'react';

import styles from './Select.module.scss';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  /** The text of the empty first option, such as "Select...". */
  placeholder: string;
  options: { value: string; label: string }[];
}

export default function Select({
  label,
  placeholder,
  options,
  className,
  id,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div className={`${styles.wrapper} ${className || ''}`}>
      {label && (
        <label className={styles.label} htmlFor={selectId}>
          {label}
        </label>
      )}
      <select id={selectId} className={styles.select} {...props}>
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
