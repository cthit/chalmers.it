import Layout, { generateMetadata as genMeta } from '@/app/[locale]/layout';
import { cookies } from 'next/headers';

export function generateMetadata() {
  const locale = cookies().get('NEXT_LOCALE')?.value ?? 'en';
  return genMeta({
    params: {
      locale
    }
  });
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const locale = cookies().get('NEXT_LOCALE')?.value ?? 'en';
  return (
    <Layout
      params={{
        locale
      }}
    >
      {children}
    </Layout>
  );
}
