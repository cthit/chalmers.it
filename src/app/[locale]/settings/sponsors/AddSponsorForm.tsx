'use client';
import React, { useState } from 'react';
import { addSponsor } from '@/actions/sponsors';
import ActionButton from '@/components/ActionButton/ActionButton';
import { toast } from 'react-toastify';
import i18nService from '@/services/i18nService';
import TextArea from '@/components/TextArea/TextArea';
import DropdownList from '@/components/DropdownList/DropdownList';

const AddSponsorForm = ({ locale }: { locale: string }) => {
  const l = i18nService.getLocale(locale);
  const [sponsorUrl, setSponsorUrl] = useState('');
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorImage, setSponsorImage] = useState<File | null>(null);
  const [type, setType] = useState<'PARTNER' | 'MAIN_PARTNER'>('PARTNER');

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSponsorName(event.target.value);
  };

  const handleSponsorUrlChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSponsorUrl(event.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSponsorImage(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', sponsorImage!);

    try {
      await toast.promise(
        addSponsor(
          {
            nameSv: sponsorName,
            nameEn: sponsorName,
            url: sponsorUrl,
            type
          },
          formData
        ),
        {
          pending: 'Adding sponsor...',
          success: 'Sponsor added!',
          error: 'Failed to add sponsor'
        }
      );
    } catch (e) {
      console.error(e);
    }

    setSponsorName('');
    setSponsorImage(null);
  };

  return (
    <tr>
      <td />
      <td>
        <DropdownList
          value={type}
          onChange={(e) => setType(e.target.value as any)}
        >
          <option value="MAIN_PARTNER">{l.sponsors.main}</option>
          <option value="PARTNER">{l.sponsors.partner}</option>
        </DropdownList>
      </td>
      <td>
        <form onSubmit={handleSubmit}>
          <TextArea
            id="sponsorName"
            value={sponsorName}
            onChange={handleNameChange}
          />
        </form>
      </td>
      <td>
        <TextArea
          id="sponsorUrl"
          value={sponsorUrl}
          onChange={handleSponsorUrlChange}
        />
      </td>
      <td>
        <input
          type="file"
          id="sponsorImage"
          accept="image/*"
          onChange={handleImageChange}
        />
      </td>
      <td>
        <ActionButton type="submit">{l.general.add}</ActionButton>
      </td>
    </tr>
  );
};

export default AddSponsorForm;
