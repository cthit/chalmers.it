import Divider from '@/components/Divider/Divider';
import NotifyService from '@/services/notifyService';
import NewNotifierForm from './NewNotifierForm';

export default async function Page() {
  const notifiers = await NotifyService.getNotifiers();

  return (
    <main>
      <title>Kontrollpanel - Notifiers</title>
      <h1>Notifiers</h1>
      <ul>
        {notifiers.map((notifier) => (
          <li key={notifier.id}>
            <h2>{notifier.type}</h2>
            <p>{notifier.language}</p>
            <p>{notifier.url}</p>
          </li>
        ))}
      </ul>
      <Divider />
      <h1>Add a notifier</h1>
      <NewNotifierForm />
    </main>
  );
}
