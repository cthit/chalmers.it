import Layout, { generateMetadata as genMeta } from '@/app/[locale]/layout';
import { cookies } from 'next/headers';

export async function generateMetadata() {
  const locale = cookies().then((c) => ({
    locale: c.get('NEXT_LOCALE')?.value ?? 'en'
  }));
  return genMeta({
    params: locale
  });
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const locale = cookies().then((c) => ({
    locale: c.get('NEXT_LOCALE')?.value ?? 'en'
  }));
  return <Layout params={locale}>{children}</Layout>;
}
