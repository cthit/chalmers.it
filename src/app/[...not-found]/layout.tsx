import Layout from '@/app/[locale]/layout';
import { cookies } from 'next/headers';

export const metadata = {
  title: '404 - Page not found',
  description: 'Software Engineering at Chalmers'
};

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
