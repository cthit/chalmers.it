'use client';

import Error from '@/components/ErrorPages/500/500';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-poppins'
});

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className={poppins.variable}>
        <Error error={error} reset={reset} />
      </body>
    </html>
  );
}
