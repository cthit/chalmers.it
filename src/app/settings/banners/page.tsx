import Divider from '@/components/Divider/Divider';
import AddBannerForm from './AddBannerForm';
import DivisionGroupService from '@/services/divisionGroupService';
import Link from 'next/link';
import DeleteBannerButton from './DeleteBannerButton';
import ActionButton from '@/components/ActionButton/ActionButton';

export default async function Page() {
  const banners = await DivisionGroupService.getBanners();
  const groups = await DivisionGroupService.getAll();

  return (
    <main>
      <title>Kontrollpanel - Banners</title>
      <h1>Banners</h1>
      <ul>
        {banners &&
          banners.map((banner) => (
            <li key={banner.id}>
              <h2>{banner.divisionGroup.prettyName}</h2>
              <p>Banner-ID {banner.id}</p>
              <ActionButton href={`/api/media/${banner.mediaSha256}`}>
                Bildlänk
              </ActionButton>{' '}
              <DeleteBannerButton banner={banner} />
            </li>
          ))}
      </ul>

      <Divider />
      <h1>Add a banner</h1>
      <AddBannerForm groups={groups} />
    </main>
  );
}
