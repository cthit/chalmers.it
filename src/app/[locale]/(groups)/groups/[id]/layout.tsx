import Banner from '@/components/Banner/Banner';
import DivisionGroupService from '@/services/divisionGroupService';
import GammaService from '@/services/gammaService';

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
