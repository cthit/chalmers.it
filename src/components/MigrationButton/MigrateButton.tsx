'use client';

import { migrate } from '@/actions/migration';
import ActionButton from '@/components/ActionButton/ActionButton';

const MigrateButton = () => {
  return (
    <ActionButton
      onClick={(_) => {
        migrate().then((r) => console.log(r));
      }}
    >
      Migrate all the things
    </ActionButton>
  );
};

export default MigrateButton;
