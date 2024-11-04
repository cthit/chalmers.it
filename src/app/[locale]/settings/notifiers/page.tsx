import NotifyService from '@/services/notifyService';
import NewNotifierForm from './NewNotifierForm';
import RemoveNotifierButton from './RemoveNotifierButton';
import i18nService from '@/services/i18nService';
import Table from '@/components/Table/Table';

export default async function Page({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const l = i18nService.getLocale(locale);
  const notifiers = await NotifyService.getNotifiers();

  return (
    <main>
      <title>
        {l.settings.common.controlPanel + ' - ' + l.settings.notifiers.name}
      </title>
      <h1>{l.settings.notifiers.name}</h1>
      <Table>
        <thead>
          <tr>
            <th>{l.settings.common.type}</th>
            <th>{l.settings.notifiers.language}</th>
            <th>Webhook URL</th>
            <th>{l.settings.common.actions}</th>
          </tr>
        </thead>
        <tbody>
          {notifiers.map((notifier) => (
            <tr key={notifier.id}>
              <td>{notifier.type}</td>
              <td>{notifier.language}</td>
              <td>{notifier.url}</td>
              <td>
                <RemoveNotifierButton locale={locale} id={notifier.id} />
              </td>
            </tr>
          ))}
          <NewNotifierForm locale={locale} />
        </tbody>
      </Table>
    </main>
  );
}
