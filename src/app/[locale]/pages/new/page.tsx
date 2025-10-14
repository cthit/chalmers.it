import ContentPane from '@/components/ContentPane/ContentPane';
import DivisionNavigation from '@/components/DivisionNavigation/DivisionNavigation';
import DivisionPageForm from '@/components/DivisionPageForm/DivisionPageForm';
import Forbidden from '@/components/ErrorPages/403/403';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import DivisionPageService from '@/services/divisionPageService';
import SessionService from '@/services/sessionService';

export default async function Page(
  props: {
    params: Promise<{ locale: string }>;
  }
) {
  const params = await props.params;

  const {
    locale
  } = params;

  if (!(await SessionService.isActive())) {
    return <Forbidden />;
  }

  const main = await mainContent(locale);
  const left = <DivisionNavigation locale={locale} />;
  const right = <div></div>;

  return <ThreePaneLayout left={left} middle={main} right={right} />;
}

async function mainContent(locale: string) {
  const pages = await DivisionPageService.get();
  return (
    <main>
      <ContentPane>
        <DivisionPageForm pages={pages} locale={locale} />
      </ContentPane>
    </main>
  );
}
