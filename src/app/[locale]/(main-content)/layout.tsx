import '@/styles/dimensions.scss';
import '@/styles/themes.scss';
import '@/styles/globals.scss';
import Banner from '@/components/Banner/Banner';

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const { children } = props;

  return (
    <>
      <Banner locale={locale} />
      {children}
    </>
  );
}
