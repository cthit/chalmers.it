
import styles from './Search.module.scss';
import { BsSearchHeartFill } from "react-icons/bs";

const Search = () => {
  return (
    <div className={styles.search}>
        <div> <BsSearchHeartFill /> </div>
    </div>
  );
};

export default Search;
