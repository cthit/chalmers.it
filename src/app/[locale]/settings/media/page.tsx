import MediaService from '@/services/mediaService';

export default async function Page() {
  const stats = await MediaService.getStats();

  return (
    <main>
      <title>Kontrollpanel - Media</title>
      <h1>Media</h1>
      <p>Stored media count: {stats.count}</p>
      <p>Media usage: {stats.size} bytes</p>
      <p>Orphaned media count: {stats.count - stats.used}</p>
    </main>
  );
}
