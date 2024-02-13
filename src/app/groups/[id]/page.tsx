import DivisionGroupService from '@/services/divisionGroupService';
import GammaService from '@/services/gammaService';

export default async function Page({ params }: { params: { id: string } }) {
  const group = (await DivisionGroupService.getInfo(
    Number.parseInt(params.id)
  ))!;
  const groupMembers = await GammaService.getSuperGroupMembers(
    group.gammaSuperGroupId
  );

  return (
    <main>
      <title>{group.prettyName}</title>
      <h1>{group.prettyName}</h1>
      <p>{group.descriptionSv}</p>
      <h2>Members</h2>
      <ul>
        {groupMembers.map((member) => (
          <li key={member.id}>
            <img src={member.avatarUrl} />
            <p>{member.nick}</p>
            <p>
              {member.unofficialPostName
                ? `${member.unofficialPostName} (${member.post.sv})`
                : member.post.sv}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
