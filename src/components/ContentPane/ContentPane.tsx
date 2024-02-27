import styles from './ContentPane.module.scss';

const ContentPane = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.content}>{children}</div>;
};

export default ContentPane;
