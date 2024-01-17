'use client'

import { post, postForGroup } from './actions';
import Divider from '@/components/Divider/Divider';
import ActionButton from '@/components/ActionButton/ActionButton';
import MarkdownEditor from '@/components/MarkdownEditor/MarkdownEditor';
import TextArea from '@/components/TextArea/TextArea';
import { GammaGroup } from '@/models/GammaModels';
import { useState } from 'react';

const NewsPostForm = ({groups}: {groups: GammaGroup[]}) => {

  const [group, setGroup] = useState('self');
  const [titleEn, setTitleEn] = useState('');
  const [titleSv, setTitleSv] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [contentSv, setContentSv] = useState('');

  async function send() {
    try {
      if (group !== 'self') {
        await postForGroup(titleEn, titleSv, contentEn, contentSv, group);
      } else {
        await post(titleEn, titleSv, contentEn, contentSv);
      }
    } catch {
      console.log('Failed to post news article');
    }
  }

  return (<>
    <h1>Posta nyhet</h1>
    <Divider />
    <h2>Posta för</h2>
    <select onChange={(e) => setGroup(e.target.value)} >
      <option value='self'>Mig själv</option>
      {groups.map((group) => (
        <option key={group.id} value={group.id}>
          {group.superGroup?.prettyName ?? group.prettyName}
        </option>
      ))}
    </select>
    <h2>Titel (Eng)</h2>
    <TextArea
      value={titleEn}
      onChange={(e) => setTitleEn(e.target.value)}
    />
    <h2>Innehåll (Eng)</h2>
    <MarkdownEditor
      value={contentEn}
      onChange={(e) => setContentEn(e.target.value)}
    />

    <h2>Titel (Sv)</h2>
    <TextArea
      value={titleSv}
      onChange={(e) => setTitleSv(e.target.value)}
    />
    <h2>Innehåll (Sv)</h2>
    <MarkdownEditor
      value={contentSv}
      onChange={(e) => setContentSv(e.target.value)}
    />

    <br />
    <ActionButton onClick={send}>Post</ActionButton>
  </>)
}

export default NewsPostForm;
