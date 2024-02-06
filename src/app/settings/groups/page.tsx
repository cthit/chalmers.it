import DivisionGroupService from '@/services/divisionGroupService';
import GammaService from '@/services/gammaService';
import AddGroupForm from './AddGroupForm';

export default async function Page() {
  const groups = await DivisionGroupService.getAll();
  const gammaGroups = await GammaService.getAllSuperGroups();

  return (
    <main>
      <title>Kontrollpanel - Grupper</title>
      <h1>Grupper</h1>
      <ul>
        {groups.map((group) => (
          <li key={group.id}>{group.prettyName}</li>
        ))}
      </ul>

      <h1>Lägg till grupp</h1>
      <AddGroupForm gammaGroups={gammaGroups} />
    </main>
  );
}
