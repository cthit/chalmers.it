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

export async function generateStaticParams() {
  return [{ lang: 'sv' }, { lang: 'en' }]
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ display: 'unset' }} className={poppins.className}>
        <ThemeProvider>
          <Header />
          <Banner />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
