import DivisionGroupService from '@/services/divisionGroupService';
import GammaService from '@/services/gammaService';
import AddGroupForm from './AddGroupForm';
import GammaGroupListItem from '@/components/GammaGroupListItem/GammaGroupListItem';
import Divider from '@/components/Divider/Divider';

export default async function Page() {
  const groups = await DivisionGroupService.getAll();
  const gammaGroups = (await GammaService.getAllSuperGroups()).filter(
    (g) => groups.find((d) => d.gammaSuperGroupId === g.id) === undefined
  );

  return (
    <main>
      <title>Kontrollpanel - Grupper</title>
      <h1>Grupper</h1>
      <ul>
        {groups.map((group) => (
          <GammaGroupListItem
            key={group.id}
            id={group.id}
            superGroupId={group.gammaSuperGroupId}
            prettyName={group.prettyName}
          />
        ))}
      </ul>

      <Divider />

      <h1>Lägg till grupp</h1>
      <AddGroupForm gammaGroups={gammaGroups} />
    </main>
  );
}
