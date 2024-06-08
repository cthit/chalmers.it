'use client';

import styles from './ToastContainerWraper.module.scss';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ToastContainerWrapper.css';

const ToastContainerWrapper = () => {
  return <ToastContainer className={styles.toastContainer} />;
};

export default ToastContainerWrapper;
