import DivisionGroupService from '@/services/divisionGroupService';
import GammaService from '@/services/gammaService';
import AddGroupForm from './AddGroupForm';
import Divider from '@/components/Divider/Divider';
import EditGroupForm from './EditGroupForm';

export default async function Page() {
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
      <title>Kontrollpanel - Grupper</title>
      <h1>Grupper</h1>
      <ul>
        {groups.map((group) => (
          <EditGroupForm
            key={group.id}
            id={group.id}
            typeId={group.divisionGroupTypeId ?? -1}
            superGroupId={group.gammaSuperGroupId}
            prettyName={group.prettyName}
            priority={group.priority}
            groupTypes={types}
          />
        ))}
      </ul>

      <Divider />

      <h1>Lägg till grupp</h1>
      <AddGroupForm gammaGroups={gammaGroups} />
    </main>
  );
}
