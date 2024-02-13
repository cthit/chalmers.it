import Divider from '@/components/Divider/Divider';
import AddBannerForm from './AddBannerForm';
import DivisionGroupService from '@/services/divisionGroupService';

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
              <h2>{banner.divisionGroupId}</h2>
              <p>{banner.mediaSha256}</p>
            </li>
          ))}
      </ul>

      <Divider />
      <h1>Add a banner</h1>
      <AddBannerForm groups={groups} />
    </main>
  );
}
