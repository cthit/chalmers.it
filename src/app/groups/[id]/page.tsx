import DivisionGroupService from '@/services/divisionGroupService';
import GammaService from '@/services/gammaService';
import style from './page.module.scss';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import DivisionNavigation from '@/components/DivisionNavigation/DivisionNavigation';
import Divider from '@/components/Divider/Divider';
import ContentPane from '@/components/ContentPane/ContentPane';

export default async function Page({ params }: { params: { id: string } }) {
  const main = await mainContent(params);
  const left = <DivisionNavigation />;
  const right = <div>Test</div>;

  return <ThreePaneLayout left={left} middle={main} right={right} />;
}

const mainContent = async ({ id }: { id: string }) => {
  const group = (await DivisionGroupService.getInfo(Number.parseInt(id)))!;
  const groupMembers = await GammaService.getSuperGroupMembers(
    group.gammaSuperGroupId
  );

  return (
    <ContentPane>
      <title>{group.prettyName}</title>
      <h1>{group.prettyName}</h1>
      <h3>{group.descriptionSv}</h3>
      <Divider />
      <h2>Nuvarande medlemmar</h2>
      <ul>
        {groupMembers.map((member) => (
          <li key={member.id}>
            <img src={member.avatarUrl} />
            <h3>{member.nick}</h3>
            <p>
              {member.unofficialPostName
                ? `${member.unofficialPostName} (${member.post.sv})`
                : member.post.sv}
            </p>
          </li>
        ))}
      </ul>
    </ContentPane>
  );
};
