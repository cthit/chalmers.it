import Header from '@/components/Header/Header';
import '@/styles/dimensions.scss';
import '@/styles/themes.scss';
import '@/styles/globals.scss';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

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
        {children}
      </body>
    </html>
  );
}
