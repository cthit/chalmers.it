'use client';
import React, { useState } from 'react';
import { addSponsor } from '@/actions/sponsors';

const AddSponsorForm = () => {
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorImage, setSponsorImage] = useState<File | null>(null);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSponsorName(event.target.value);
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

    addSponsor(
      {
        nameSv: sponsorName,
        nameEn: sponsorName,
        descriptionSv: 'yeppers peppers',
        descriptionEn: 'yeppers peppers'
      },
      formData
    );

    setSponsorName('');
    setSponsorImage(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="sponsorName">Sponsor Name:</label>
        <input
          type="text"
          id="sponsorName"
          value={sponsorName}
          onChange={handleNameChange}
        />
      </div>
      <div>
        <label htmlFor="sponsorImage">Sponsor Image:</label>
        <input
          type="file"
          id="sponsorImage"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
      <button type="submit">Add Sponsor</button>
    </form>
  );
};

export default AddSponsorForm;
