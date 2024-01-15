'use client';

import { useState } from 'react';
import { post } from './actions';
import style from './page.module.scss';
import Divider from '@/components/Divider/Divider';

export default function Page({ params }: { params: { id: string } }) {
  const [titleEn, setTitleEn] = useState('');
  const [titleSv, setTitleSv] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [contentSv, setContentSv] = useState('');

  async function send() {
    await post(titleEn, titleSv, contentEn, contentSv);
  }

  return (
    <main className={style.main}>
      <div className={style.content}>
        <h1>Posta nyhet</h1>
        <Divider />
        <h2>Titel (Eng)</h2>
        <input
          type="text"
          value={titleEn}
          onChange={(e) => setTitleEn(e.target.value)}
        />
        <h2>Innehåll (Eng)</h2>
        <textarea
          value={contentEn}
          onChange={(e) => setContentEn(e.target.value)}
        />

        <h2>Titel (Sv)</h2>
        <input
          type="text"
          value={titleSv}
          onChange={(e) => setTitleSv(e.target.value)}
        />
        <h2>Innehåll (Sv)</h2>
        <textarea
          value={contentSv}
          onChange={(e) => setContentSv(e.target.value)}
        />

        <br />
        <button onClick={(e) => send()}>Post</button>
      </div>
    </main>
  );
}
