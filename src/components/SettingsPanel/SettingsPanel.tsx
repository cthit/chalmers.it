'use client';

import { usePathname } from 'next/navigation';
import style from './SettingsPanel.module.scss';
import Link from 'next/link';
import Forbidden from '../ErrorPages/403/403';
import ContentPane from '../ContentPane/ContentPane';

const SettingsPanel = ({
  children,
  pages
}: {
  children: React.ReactNode;
  pages: { path: string; name: string }[];
}) => {
  const pathname = usePathname();

  const hasAccess = pages.some((page) => page.path === pathname);
  if (!hasAccess) {
    return <Forbidden />;
  }

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
};

export default SettingsPanel;
