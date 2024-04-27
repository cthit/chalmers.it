import Layout, { metadata as data } from '@/app/[locale]/layout';

export const metadata = data;

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
