import Header from '@/components/Header/Header';
import '@/styles/dimensions.scss';
import '@/styles/themes.scss';
import '@/styles/globals.scss';
import { Poppins } from 'next/font/google';
import Banner from '@/components/Banner/Banner';
import { ThemeProvider } from '@/components/ThemeProvider/ThemeProvider';
import TopLoader from '@/components/TopLoader/TopLoader';
import ToastContainerWrapper from '@/components/ToastContainerWrapper/ToastContainerWrapper';
import DivisionGroupService from '@/services/divisionGroupService';
import GammaService from '@/services/gammaService';
import { Metadata } from 'next';
import i18nService from '@/services/i18nService';

const poppins = Poppins({ weight: ['400'], subsets: ['latin'] });

export async function generateMetadata(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const params = await props.params;

  const { locale, id } = params;

  const group = await DivisionGroupService.getInfoBySlug(id).catch(() => {
    return null;
  });
  const l = i18nService.getLocale(locale);
  return {
    title:
      group !== null
        ? group.prettyName + ' - ' + l.site.siteTitle
        : l.site.siteTitle,
    description: l.site.siteDescription
  } as Metadata;
}

export const dynamicParams = false;

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string; id: string }>;
}) {
  const params = await props.params;

  const { locale, id } = params;

  const { children } = props;

  const group = await DivisionGroupService.getInfoBySlug(id).catch((e) => {
    console.error(`${e.name}:`, e.message);
    return null;
  });
  const groupUrl =
    (group && GammaService.getSuperGroupBannerURL(group?.gammaSuperGroupId)) ??
    undefined;

  return (
    <html lang={locale}>
      <body style={{ display: 'unset' }} className={poppins.className}>
        <ThemeProvider>
          <TopLoader />
          <Header locale={locale} />
          <Banner locale={locale} name={group?.prettyName} url={groupUrl} />
          {children}
          <ToastContainerWrapper />
        </ThemeProvider>
      </body>
    </html>
  );
}
