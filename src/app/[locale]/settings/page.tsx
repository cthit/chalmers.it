'use client';

import ActionButton from '@/components/ActionButton/ActionButton';
import { migrate } from '@/actions/migration';

export default function Page() {
  return (
    <main>
      <title>Kontrollpanel</title>
      <p>There is nothing to see here yet. Please check back later!</p>
      <ActionButton
        onClick={(_) => {
          migrate().then((r) => console.log(r));
        }}
      >
        Migrate
      </ActionButton>
    </main>
  );
}
