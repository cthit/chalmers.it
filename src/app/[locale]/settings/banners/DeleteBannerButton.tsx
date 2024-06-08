'use client';
import React from 'react';
import ActionButton from '@/components/ActionButton/ActionButton';
import { deleteBanner } from '@/actions/banners';

const DeleteBannerButton = ({
  banner
}: {
  banner: {
    id: number;
  };
}) => {
  return (
    <ActionButton onClick={() => deleteBanner(banner.id)}>Ta bort</ActionButton>
  );
};

export default DeleteBannerButton;
