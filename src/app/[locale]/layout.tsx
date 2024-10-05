import i18nConfig from '@/i18nConfig';
import Header from '@/components/Header/Header';
import '@/styles/dimensions.scss';
import '@/styles/themes.scss';
import '@/styles/globals.scss';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import Banner from '@/components/Banner/Banner';
import { ThemeProvider } from '@/components/ThemeProvider/ThemeProvider';
import TopLoader from '@/components/TopLoader/TopLoader';
import i18nService from '@/services/i18nService';
import ToastContainerWrapper from '@/components/ToastContainerWrapper/ToastContainerWrapper';
import NotFound from '@/components/ErrorPages/404/404';

const poppins = Poppins({ weight: ['400'], subsets: ['latin'] });

export function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Metadata {
  const l = i18nService.getLocale(locale);
  return {
    title: l.site.siteTitle,
    description: l.site.siteDescription
  };
}

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export const dynamic = 'force-dynamic';
export const dynamicParams = false;
export const revalidate = false;

export default function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const invalidLocale = !i18nConfig.locales.includes(locale);
  return (
    <html lang={locale}>
      <body style={{ display: 'unset' }} className={poppins.className}>
        <ThemeProvider>
          <TopLoader />
          <Header locale={locale} />
          <Banner locale={locale} />
          {invalidLocale ? <NotFound /> : children}
          <ToastContainerWrapper />
        </ThemeProvider>
      </body>
    </html>
  );
}
