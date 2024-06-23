import SessionService from '@/services/sessionService';

const GroupActive = async ({
  group,
  children
}: {
  group?: string;
  children: React.ReactNode;
}) => {
  if (!(await SessionService.isActive().catch(() => false))) return <></>;
  if (group && !(group ? await SessionService.canEditGroup(group) : false))
    return <></>;
  return <>{children}</>;
};

export default GroupActive;
