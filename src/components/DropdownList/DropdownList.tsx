import styles from './DropdownList.module.scss';
import React, { SelectHTMLAttributes } from 'react';

export default class DropdownList extends React.Component<
  SelectHTMLAttributes<HTMLSelectElement>
> {
  render() {
    const { className, children, ...rest } = this.props;
    return (
      <select className={`${className} ${styles.list}`} {...rest}>
        {children}
      </select>
    );
  }
}
