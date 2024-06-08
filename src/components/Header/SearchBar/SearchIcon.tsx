import { BsSearchHeartFill } from 'react-icons/bs';
import { IconBaseProps } from 'react-icons/lib';
import styles from './SearchIcon.module.scss';

const SearchIcon = ({ className, ...rest }: IconBaseProps) => {
  return <BsSearchHeartFill className={styles.searchIcon} {...rest} />;
};

export default SearchIcon;
