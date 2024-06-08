import Layout from '@/app/[locale]/layout';

export const metadata = {
  title: '404 - Page not found',
  description: 'Software Engineering at Chalmers'
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
