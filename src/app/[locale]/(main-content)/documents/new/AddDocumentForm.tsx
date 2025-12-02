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
import i18nService from '@/services/i18nService';
import { toast } from 'react-toastify';

const validMimes = FileService.getValidMimes([MediaType.Document]);

const AddDocumentForm = ({
  groups,
  locale
}: {
  groups: GammaGroup[];
  locale: string;
}) => {
  const [groupId, setGroupId] = useState<string | undefined>(undefined);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [type, setType] = useState<string>(DocumentType.MISC);
  const [titleSv, setTitleSv] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descriptionSv, setDescriptionSv] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');

  const l = i18nService.getLocale(locale);

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

    await toast.promise(
      addDocument(
        groupId,
        titleSv,
        titleEn,
        descriptionSv,
        descriptionEn,
        formData,
        type as DocumentType
      ),
      {
        pending: l.docs.uploading,
        success: l.docs.uploaded,
        error: l.docs.uploadError
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>{l.editor.createAs} </label>
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
        <label>{l.docs.type} </label>
        <DropdownList value={type} onChange={(e) => setType(e.target.value)}>
          {Object.keys(DocumentType).map((type) => (
            <option key={type} value={type}>
              {
                l.docTypes[
                  DivisionDocumentService.documentTypeKey(type as DocumentType)
                ]
              }
            </option>
          ))}
        </DropdownList>
      </div>
      <label>{l.editor.title} (sv)</label>
      <TextArea value={titleSv} onChange={(e) => setTitleSv(e.target.value)} />
      <label>{l.editor.title} (en)</label>
      <TextArea value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
      <label>{l.editor.description} (sv)</label>
      <TextArea
        value={descriptionSv}
        onChange={(e) => setDescriptionSv(e.target.value)}
      />
      <label>{l.editor.description} (en)</label>
      <TextArea
        value={descriptionEn}
        onChange={(e) => setDescriptionEn(e.target.value)}
      />
      <div>
        <label htmlFor="documentFile">{l.docs.file}: </label>
        <input
          type="file"
          id="documentFile"
          accept={validMimes.join(',')}
          onChange={handleDocChange}
        />
      </div>
      <ActionButton type="submit">{l.general.upload}</ActionButton>
    </form>
  );
};

export default AddDocumentForm;
