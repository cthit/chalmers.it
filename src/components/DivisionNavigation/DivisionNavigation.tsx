import DivisionGroupService from "@/services/divisionGroupService";

const DivisionNavigation = async () => {
    const groups = await DivisionGroupService.getAll();

    return (
        <div>
        <h1>Kommitter, föreningar och andra instanser</h1>
        <ul>
            {groups.map((group) => (
            <li key={group.id}>
                <a href={`/groups/${group.id}`}>{group.prettyName}</a>
            </li>
            ))}
        </ul>
        </div>
    );
}

export default DivisionNavigation;
