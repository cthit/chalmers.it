'use server';

import Unauthorized from '@/components/ErrorPages/401/401';
import SettingsPanel from '@/components/SettingsPanel/SettingsPanel';
import i18nService from '@/services/i18nService';
import SessionService from '@/services/sessionService';

const pages: {
  path: string;
  lPath:
    | 'general'
    | 'notifiers'
    | 'groups'
    | 'groupTypes'
    | 'sponsors'
    | 'media'
    | 'navbar';
  authFunc: () => Promise<boolean>;
}[] = [
  {
    path: '/settings',
    lPath: 'general',
    authFunc: async () => true
  },
  {
    path: '/settings/notifiers',
    lPath: 'notifiers',
    authFunc: SessionService.isAdmin
  },
  {
    path: '/settings/groups',
    lPath: 'groups',
    authFunc: SessionService.isAdmin
  },
  {
    path: '/settings/group-types',
    lPath: 'groupTypes',
    authFunc: async () => await SessionService.isAdmin()
  },
  {
    path: '/settings/sponsors',
    lPath: 'sponsors',
    authFunc: async () =>
      (await SessionService.isCorporateRelations()) ||
      (await SessionService.isAdmin())
  },
  {
    path: '/settings/media',
    lPath: 'media',
    authFunc: SessionService.isAdmin
  },
  {
    path: '/settings/navbar',
    lPath: 'navbar',
    authFunc: SessionService.isAdmin
  }
];

export default async function SettingsLayout({
  params: { locale },
  children
}: {
  params: { locale: string };
  children: React.ReactNode;
}) {
  const l = i18nService.getLocale(locale);
  const session = await SessionService.getUser();

  if (!session) {
    return <Unauthorized />;
  }

  let authPages: any[] | undefined = [];
  for (const page of pages) {
    const res = await page.authFunc().catch(() => undefined);
    if (res === undefined) {
      authPages = undefined;
      break;
    }

    if (res) {
      authPages.push({ path: page.path, name: l.settings[page.lPath].name });
    }
  }

  return authPages === undefined ? (
    <Unauthorized />
  ) : (
    <SettingsPanel pages={authPages}>{children}</SettingsPanel>
  );
}
