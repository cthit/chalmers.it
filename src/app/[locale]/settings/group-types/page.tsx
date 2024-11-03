import DivisionGroupService from '@/services/divisionGroupService';
import AddTypeForm from './AddTypeForm';
import Divider from '@/components/Divider/Divider';
import EditTypeForm from './EditTypeForm';
import i18nService from '@/services/i18nService';

export default async function Page({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const types = await DivisionGroupService.getGroupTypes();
  types.pop();
  const l = i18nService.getLocale(locale);

  return (
    <main>
      <title>
        {l.settings.common.controlPanel + ' - ' + l.settings.groupTypes.name}
      </title>
      <h1>{l.settings.groupTypes.name}</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>{l.settings.common.nameEn}</th>
            <th>{l.settings.common.nameSv}</th>
            <th>{l.settings.common.priority}</th>
            <th>{l.settings.common.actions}</th>
          </tr>
        </thead>
        <tbody>
          {types.map((type) => (
            <EditTypeForm key={type.id} type={type} locale={locale} />
          ))}
        </tbody>
      </table>

      <Divider />

      <h1>{l.settings.groupTypes.add}</h1>
      <AddTypeForm locale={locale} />
    </main>
  );
}
