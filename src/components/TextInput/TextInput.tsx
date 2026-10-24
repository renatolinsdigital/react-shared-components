'use client';
import React, { useId } from 'react';

import styles from './TextInput.module.scss';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function TextInput({ label, error, className, id, ...props }: TextInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={`${styles.wrapper} ${error ? styles.error : ''} ${className || ''}`}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}
      <input id={inputId} className={styles.input} {...props} />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
