import SessionService from '@/services/sessionService';
import MigrateButton from '@/components/MigrationButton/MigrateButton';

export default async function Page() {
  return (
    <main>
      <title>Kontrollpanel</title>
      <p>There is nothing to see here yet. Please check back later!</p>
      {(await SessionService.isAdmin()) && <MigrateButton />}
    </main>
  );
}
