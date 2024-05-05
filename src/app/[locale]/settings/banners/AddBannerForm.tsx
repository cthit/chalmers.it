'use client';
import React, { useState } from 'react';
import { addBanner } from '@/actions/banners';
import DropdownList from '@/components/DropdownList/DropdownList';
import ActionButton from '@/components/ActionButton/ActionButton';
import { toast } from 'react-toastify';

const AddBannerForm = ({
  groups
}: {
  groups: {
    id: number;
    gammaSuperGroupId: string;
    prettyName: string;
    descriptionSv: string;
    descriptionEn: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}) => {
  const [groupId, setGroupId] = useState<number | undefined>(undefined);
  const [bannerImage, setBannerImage] = useState<File | null>(null);

  const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGroupId(Number(event.target.value));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setBannerImage(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    if (groupId === undefined) return;

    event.preventDefault();

    const formData = new FormData();
    formData.append('file', bannerImage!);

    try {
      await toast.promise(addBanner(groupId, formData), {
        pending: 'Adding banner...',
        success: 'Banner added!',
        error: 'Failed to add banner'
      });
    } catch (e) {
      console.error(e);
    }

    setGroupId(0);
    setBannerImage(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="sponsorName">Gamma Group:</label>
        <DropdownList onChange={handleGroupChange}>
          <option value={undefined} hidden>
            Select a group
          </option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.prettyName}
            </option>
          ))}
        </DropdownList>
      </div>
      <div>
        <label htmlFor="sponsorImage">Banner Image:</label>
        <input
          type="file"
          id="sponsorImage"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
      <ActionButton type="submit">Add Banner</ActionButton>
    </form>
  );
};

export default AddBannerForm;
