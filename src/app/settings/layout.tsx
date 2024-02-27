'use server';

import Unauthorized from '@/components/ErrorPages/401/401';
import SettingsPanel from '@/components/SettingsPanel/SettingsPanel';
import SessionService from '@/services/sessionService';

const pages = [
  {
    path: '/settings',
    name: 'General',
    authFunc: async () => true
  },
  {
    path: '/settings/notifiers',
    name: 'Notifiers',
    authFunc: SessionService.isAdmin
  },
  {
    path: '/settings/groups',
    name: 'Division Groups',
    authFunc: SessionService.isAdmin
  },
  {
    path: '/settings/banners',
    name: 'Banner Images',
    authFunc: SessionService.isActive
  },
  {
    path: '/settings/sponsors',
    name: 'Sponsors',
    authFunc: async () =>
      (await SessionService.isCorporateRelations()) ||
      (await SessionService.isAdmin())
  },
  {
    path: '/settings/media',
    name: 'Media',
    authFunc: SessionService.isAdmin
  }
];

export default async function SettingsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await SessionService.getUser();

  if (!session) {
    return <Unauthorized />;
  }

  let authPages = [];
  for (const page of pages) {
    if (await page.authFunc()) {
      authPages.push({ path: page.path, name: page.name });
    }
  }

  return <SettingsPanel pages={authPages}>{children}</SettingsPanel>;
}
