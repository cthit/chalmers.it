'use client';

import { AppProgressBar } from 'next-nprogress-bar';

const TopLoader = () => {
  return <AppProgressBar color="var(--md-primary)" height="2px" delay={300} />;
};

export default TopLoader;
