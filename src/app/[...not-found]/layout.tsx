import { Metadata } from 'next';
import Layout from '@/app/[locale]/layout';

export const metadata: Metadata = {
  title: 'IT på Chalmers',
  description: 'Teknologsektionen Informationsteknik'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout
      params={{
        locale: 'en'
      }}
    >
      {children}
    </Layout>
  );
}
