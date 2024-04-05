'use client';
import React, { useState } from 'react';
import { addDocument } from '@/actions/documents';
import DropdownList from '@/components/DropdownList/DropdownList';
import { GammaGroup } from '@/types/gamma';
import TextArea from '@/components/TextArea/TextArea';

const AddDocumentForm = ({ groups }: { groups: GammaGroup[] }) => {
  const [groupId, setGroupId] = useState<string | undefined>(undefined);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [titleSv, setTitleSv] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descriptionSv, setDescriptionSv] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setDocumentFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    if (groupId === undefined) return;

    event.preventDefault();

    const formData = new FormData();
    formData.append('file', documentFile!);

    addDocument(
      groupId,
      titleSv,
      titleEn,
      descriptionSv,
      descriptionEn,
      formData
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="sponsorName">Skapa som: </label>
        <DropdownList onChange={(e) => setGroupId(e.target.value)}>
          <option value={undefined} hidden>
            Select a group
          </option>
          {groups.map((group) => (
            <option key={group.superGroup!.id} value={group.superGroup!.id}>
              {group.superGroup?.prettyName ?? group.prettyName}
            </option>
          ))}
        </DropdownList>
      </div>
      <label htmlFor="titleSv">Titel (svenska): </label>
      <TextArea value={titleSv} onChange={(e) => setTitleSv(e.target.value)} />
      <label htmlFor="titleEn">Titel (engelska): </label>
      <TextArea value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
      <label htmlFor="descriptionSv">Beskrivning (svenska): </label>
      <TextArea
        value={descriptionSv}
        onChange={(e) => setDescriptionSv(e.target.value)}
      />
      <label htmlFor="descriptionEn">Beskrivning (engelska): </label>
      <TextArea
        value={descriptionEn}
        onChange={(e) => setDescriptionEn(e.target.value)}
      />
      <div>
        <label htmlFor="documentFile">PDF-fil: </label>
        <input
          type="file"
          id="documentFile"
          accept="application/pdf"
          onChange={handleImageChange}
        />
      </div>
      <button type="submit">Ladda upp</button>
    </form>
  );
};

export default AddDocumentForm;
