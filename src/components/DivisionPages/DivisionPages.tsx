import styles from './DivisionPages.module.scss';
import DivisionPageService from '@/services/divisionPageService';
import Link from 'next/link';

const indent = (depth: number) => {
  return {
    marginLeft: `${depth * 10}px`
  };
};

const DivisionPages = async ({
  en,
  group,
  slug,
  visitedSlug
}: {
  en: boolean;
  group?: number;
  slug: string;
  visitedSlug?: string;
}) => {
  const groupPages = await DivisionPageService.get(group);
  const depthOffset = group ? 1 : 0;
  return groupPages.map((page) => {
    const completeSlug = `${slug}/${page.completeSlug.join('/')}`;
    return (
      <li key={completeSlug} style={indent(page.depth + depthOffset)}>
        <Link
          href={completeSlug}
          className={visitedSlug === completeSlug ? styles.selected : undefined}
        >
          {en ? page.titleEn : page.titleSv}
        </Link>
      </li>
    );
  });
};

export default DivisionPages;
