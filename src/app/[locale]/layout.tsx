import i18nConfig from '@/i18nConfig';
import Header from '@/components/Header/Header';
import '@/styles/dimensions.scss';
import '@/styles/themes.scss';
import '@/styles/globals.scss';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import Banner from '@/components/Banner/Banner';
import { ThemeProvider } from '@/components/ThemeProvider/ThemeProvider';

const poppins = Poppins({ weight: ['400'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'IT på Chalmers',
  description: 'Teknologsektionen Informationsteknik'
};

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export default function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale}>
      <body style={{ display: 'unset' }} className={poppins.className}>
        <ThemeProvider>
          <Header locale={locale} />
          <Banner locale={locale} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
