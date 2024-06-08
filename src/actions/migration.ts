'use server';

import MigrationService from '@/services/migrationService';
import SessionService from '@/services/sessionService';

export async function migrate() {
  if (!(await SessionService.isAdmin())) {
    throw new Error('Unauthorized');
  }
  MigrationService.migrate();
}
