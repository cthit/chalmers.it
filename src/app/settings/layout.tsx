'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import style from './layout.module.scss';
import ContentPane from '@/components/ContentPane/ContentPane';

const pages = [
  {
    path: '/settings',
    name: 'General'
  },
  {
    path: '/settings/notifiers',
    name: 'Notifiers'
  },
  {
    path: '/settings/groups',
    name: 'Division Groups'
  },
  {
    path: '/settings/banners',
    name: 'Banner Images'
  },
  {
    path: '/settings/sponsors',
    name: 'Sponsors'
  },
  {
    path: '/settings/media',
    name: 'Media'
  }
];

export default function SettingsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className={style.main}>
    <ContentPane>
      <div className={style.settingsPane}>
        <div className={style.navPane}>
          {pages.map((page) => (
            <Link
              className={`${style.navLink} ${
                pathname === page.path && style.currentLink
              }`}
              href={page.path}
              key={page.path}
            >
              {page.name}
            </Link>
          ))}
        </div>
        <div className={style.settingsContent}>{children}</div>
      </div>
    </ContentPane>
    </div>

  );
}
