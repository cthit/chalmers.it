'use client';

export default function Page({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h1>Error 500</h1>
      <h2>Couldn&apos;t load this page content due to a server-side error</h2>
      Please report this to{' '}
      <a href="mailto:digit@chalmers.it">digit@chalmers.it</a> or{' '}
      <a href="https://github.com/cthit/chalmers.it/issues/new/choose">
        create an issue
      </a>
      .{digestError(error)}
    </div>
  );
}

const digestError = (error: { digest?: string }) => {
  if (error.digest != undefined) {
    return <p>Digest: {error.digest}</p>;
  }
};
