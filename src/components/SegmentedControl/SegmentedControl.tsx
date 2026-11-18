'use client';

import React from 'react';
import styles from './SegmentedControl.module.scss';

export interface SegmentedControlOption {
  value: string;
  label: React.ReactNode;
  title?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

interface SegmentedControlProps {
  value: string;
  options: SegmentedControlOption[];
  onChange: (value: string) => void;
  className?: string;
  buttonClassName?: string;
  ariaLabel?: string;
}

const SegmentedControl = ({
  value,
  options,
  onChange,
  className,
  buttonClassName,
  ariaLabel
}: SegmentedControlProps) => {
  return (
    <div
      className={`${styles.segmentedControl} ${className ?? ''}`}
      role="group"
      aria-label={ariaLabel}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`${styles.button} ${
            value === option.value ? styles.active : ''
          } ${buttonClassName ?? ''}`}
          aria-pressed={value === option.value}
          aria-label={option.ariaLabel}
          title={option.title}
          disabled={option.disabled}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;
