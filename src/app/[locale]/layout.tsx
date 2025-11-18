import i18nConfig from '@/i18nConfig';
import Header from '@/components/Header/Header';
import '@/styles/dimensions.scss';
import '@/styles/themes.scss';
import '@/styles/globals.scss';
import type { Metadata } from 'next';
import { Bitter, Poppins } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider/ThemeProvider';
import TopLoader from '@/components/TopLoader/TopLoader';
import i18nService from '@/services/i18nService';
import ToastContainerWrapper from '@/components/ToastContainerWrapper/ToastContainerWrapper';
import NotFound from '@/components/ErrorPages/404/404';

const poppins = Poppins({
  weight: ['100', '400', '500'],
  subsets: ['latin'],
  variable: '--font-poppins'
});

const bitter = Bitter({
  weight: ['500', '600'],
  subsets: ['latin'],
  variable: '--font-bitter'
});

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;

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

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { locale } = params;

  const { children } = props;

  const invalidLocale = !i18nConfig.locales.includes(locale);
  return (
    <html lang={locale}>
      <body
        style={{ display: 'unset' }}
        className={poppins.variable + ' ' + bitter.variable}
      >
        <ThemeProvider>
          <TopLoader />
          <Header locale={locale} />
          {invalidLocale ? <NotFound /> : children}
          <ToastContainerWrapper />
        </ThemeProvider>
      </body>
    </html>
  );
}
