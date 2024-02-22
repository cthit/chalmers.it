import Header from '@/components/Header/Header';
import './styles/dimensions.scss';
import './styles/themes.scss';
import './globals.scss';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import Banner from '@/components/Banner/Banner';

const poppins = Poppins({ weight: ['400'], subsets: ['latin'] });

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
    <html lang="en">
      <body className={poppins.className}>
        <Header />
        <Banner />
        {children}
      </body>
    </html>
  );
}
