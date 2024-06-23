import { InputHTMLAttributes } from 'react';
import styles from './DatePicker.module.scss';

const convertToDateTimeLocalString = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

interface DatePickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: Date;
  onChange?: (date: Date) => void;
}

const DatePicker = ({
  value,
  onChange,
  className,
  ...rest
}: DatePickerProps) => {
  return (
    <input
      className={`${styles.picker} ${className}`}
      type="datetime-local"
      value={value && convertToDateTimeLocalString(value)}
      onChange={(e) => onChange && onChange(new Date(e.target.value))}
      {...rest}
    />
  );
};

export default DatePicker;
