import DivisionGroupService from '@/services/divisionGroupService';
import AddTypeForm from './AddTypeForm';
import Divider from '@/components/Divider/Divider';
import EditTypeForm from './EditTypeForm';

export default async function Page() {
  let types = await DivisionGroupService.getGroupTypes();
  types.pop();

  return (
    <main>
      <title>Kontrollpanel - Grupptyper</title>
      <h1>Grupptyper</h1>
      <ul>
        {types.map((type) => (
          <li key={type.id}>
            ID {type.id}
            <EditTypeForm type={type} />
          </li>
        ))}
      </ul>

      <Divider />

      <h1>Lägg till grupptyp</h1>
      <AddTypeForm />
    </main>
  );
}
