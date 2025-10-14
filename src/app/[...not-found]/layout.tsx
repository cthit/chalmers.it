import Layout, { generateMetadata as genMeta } from '@/app/[locale]/layout';
import { cookies } from 'next/headers';

export async function generateMetadata() {
  const locale = (await cookies()).get('NEXT_LOCALE')?.value ?? 'en';
  return genMeta({
    params: {
      locale
    }
  });
}

export default async function RootLayout(
  {
    children
  }: {
    children: React.ReactNode;
  }
) {
  const locale = (await cookies()).get('NEXT_LOCALE')?.value ?? 'en';
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
