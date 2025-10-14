import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import ContactCard from '@/components/ContactCard/ContactCard';
import ContentPane from '@/components/ContentPane/ContentPane';
import Divider from '@/components/Divider/Divider';
import i18nService from '@/services/i18nService';

export const revalidate = 3600;

export default async function Home(
  props: {
    params: Promise<{ locale: string }>;
  }
) {
  const params = await props.params;

  const {
    locale
  } = params;

  return (
    <main>
      <ThreePaneLayout
        middle={<About locale={locale} />}
        right={<ContactCard locale={locale} />}
      />
    </main>
  );
}

const About = ({ locale }: { locale: string }) => {
  const l = i18nService.getLocale(locale);
  return (
    <ContentPane>
      <h1>{l.about.title}</h1>
      <Divider />
      {locale === 'en' ? <AboutEn /> : <AboutSv />}
    </ContentPane>
  );
};

const AboutEn = () => {
  return (
    <>
      <h1>Development Team</h1>
      <p>
        Original version developed by digIT 12/13 and rebuilt in Ruby on Rails
        by digIT 14/15.
      </p>
      <p>
        Next.js rewrite and redesign developed by digIT 23/24 and digIT 24/25
        along with:
      </p>
      <br />
      <p>
        Gustaf &#x0022;Goose&#x0022; Asplund - digIT 23/24 - Development lead
      </p>
      <p>Atosa &#x0022;Katt&#x0022; Daneshvar - digIT 23/24 - New design</p>
      <p>
        Oscar &#x0022;Space&#x0022; Eriksson - digIT 23/24 - System design and
        interface
      </p>
      <p>
        Simon &#x0022;Casino&#x0022; Westlin Green - digIT 24/25 - Interface
      </p>
      <br />

      <h1>Special Thanks</h1>
      <p>
        Theodor &#x0022;Portals&#x0022; Angergård - digIT 18/19 - Help with
        integration to Gamma 2.0
      </p>
      <br />

      <h1>Frameworks and libraries</h1>
      <p>NextJS</p>
      <p>React</p>
      <p>Prisma</p>
    </>
  );
};

const AboutSv = () => {
  return (
    <>
      <h1>Utvecklingsteam</h1>
      <p>
        Originalversion utvecklad av digIT 12/13 och omskriven i Ruby on Rails
        av digIT 14/15.
      </p>
      <p>
        Next.js-omskrivning och ny design utvecklad av digIT 23/24 och digIT
        24/25 tillsammans med:
      </p>
      <br />
      <p>
        Gustaf &#x0022;Goose&#x0022; Asplund - digIT 23/24 - Utvecklingsledare
      </p>
      <p>Atosa &#x0022;Katt&#x0022; Daneshvar - digIT 23/24 - Ny design</p>
      <p>
        Oscar &#x0022;Space&#x0022; Eriksson - digIT 23/24 - Systemdesign och
        gränssnitt
      </p>
      <p>
        Simon &#x0022;Casino&#x0022; Westlin Green - digIT 24/25 - Gränssnitt
      </p>
      <br />

      <h1>Tack till</h1>
      <p>
        Theodor &#x0022;Portals&#x0022; Angergård - digIT 18/19 - Hjälp med
        integration till Gamma 2.0
      </p>
      <br />

      <h1>Ramverk och bibliotek</h1>
      <p>NextJS</p>
      <p>React</p>
      <p>Prisma</p>
    </>
  );
};
