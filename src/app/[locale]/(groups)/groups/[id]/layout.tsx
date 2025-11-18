import Banner from '@/components/Banner/Banner';
import DivisionGroupService from '@/services/divisionGroupService';
import GammaService from '@/services/gammaService';
import { Metadata } from 'next';
import i18nService from '@/services/i18nService';

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

export default async function GroupLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await props.params;
  const { children } = props;

  const group = await DivisionGroupService.getInfoBySlug(id).catch((e) => {
    console.error(`${e.name}:`, e.message);
    return null;
  });
  const groupUrl =
    (group && GammaService.getSuperGroupBannerURL(group?.gammaSuperGroupId)) ??
    undefined;

  return (
    <>
      <Banner locale={locale} name={group?.prettyName} url={groupUrl} />
      {children}
    </>
  );
}
