'use client';
import React, { useId } from 'react';

import styles from './TextArea.module.scss';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export default function TextArea({ label, className, id, ...props }: TextAreaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  return (
    <div className={`${styles.wrapper} ${className || ''}`}>
      {label && (
        <label className={styles.label} htmlFor={textareaId}>
          {label}
        </label>
      )}
      <textarea id={textareaId} className={styles.textarea} {...props} />
    </div>
  );
}
