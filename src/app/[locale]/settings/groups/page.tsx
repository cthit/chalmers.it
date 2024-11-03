import DivisionGroupService from '@/services/divisionGroupService';
import GammaService from '@/services/gammaService';
import AddGroupForm from './AddGroupForm';
import Divider from '@/components/Divider/Divider';
import EditGroupForm from './EditGroupForm';
import i18nService from '@/services/i18nService';
import Table from '@/components/Table/Table';

export default async function Page({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const l = i18nService.getLocale(locale);
  const groups = await DivisionGroupService.getAll();
  const gammaGroups = (await GammaService.getAllSuperGroups())
    .filter(
      (g) =>
        groups.find((d) => d.gammaSuperGroupId === g.superGroup.id) ===
        undefined
    )
    .flatMap((g) => g.superGroup);
  const types = await DivisionGroupService.getGroupTypes();

  return (
    <main>
      <title>
        {l.settings.common.controlPanel + ' - ' + l.settings.groups.name}
      </title>
      <h1>{l.settings.groups.name}</h1>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>{l.settings.common.name}</th>
            <th>{l.settings.common.priority}</th>
            <th>{l.settings.groups.category}</th>
            <th>{l.settings.common.actions}</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <EditGroupForm
              key={group.id}
              locale={locale}
              id={group.id}
              typeId={group.divisionGroupTypeId ?? -1}
              superGroupId={group.gammaSuperGroupId}
              prettyName={group.prettyName}
              priority={group.priority}
              groupTypes={types}
            />
          ))}
          <AddGroupForm gammaGroups={gammaGroups} locale={locale} />
        </tbody>
      </Table>
    </main>
  );
}
