'use client';
import React, { useState } from 'react';
import { addDocument } from '@/actions/documents';
import DropdownList from '@/components/DropdownList/DropdownList';
import { GammaGroup } from '@/types/gamma';
import TextArea from '@/components/TextArea/TextArea';
import { DocumentType } from '@prisma/client';
import DivisionDocumentService from '@/services/divisionDocumentService';
import ActionButton from '@/components/ActionButton/ActionButton';
import FileService, { MediaType } from '@/services/fileService';

const validMimes = FileService.getValidMimes([MediaType.Document]);

const AddDocumentForm = ({ groups }: { groups: GammaGroup[] }) => {
  const [groupId, setGroupId] = useState<string | undefined>(undefined);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [type, setType] = useState<string>(DocumentType.MISC);
  const [titleSv, setTitleSv] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descriptionSv, setDescriptionSv] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');

  const handleDocChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      formData,
      type as DocumentType
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="createAsGroup">Skapa som </label>
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
      <div>
        <label htmlFor="createAsGroup">Dokumenttyp </label>
        <DropdownList value={type} onChange={(e) => setType(e.target.value)}>
          {Object.keys(DocumentType).map((type) => (
            <option key={type} value={type}>
              {DivisionDocumentService.documentPrettyType(type as DocumentType)}
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
        <label htmlFor="documentFile">Dokumentfil: </label>
        <input
          type="file"
          id="documentFile"
          accept={validMimes.join(',')}
          onChange={handleDocChange}
        />
      </div>
      <ActionButton type="submit">Ladda upp</ActionButton>
    </form>
  );
};

export default AddDocumentForm;
