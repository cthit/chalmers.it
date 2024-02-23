'use client';

import Error from '@/components/ErrorPages/500/500';

export default function Page({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <Error error={error} reset={reset} />;
}
