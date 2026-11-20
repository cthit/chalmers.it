'use client';

import { useCallback, useEffect, useState } from 'react';
import { NewsPostDraft } from './eventDraft';

const DRAFT_SAVE_DELAY_MS = 500;

interface UseNewsPostDraftOptions {
  draftKey: string;
  initialDraft: NewsPostDraft | null;
  serverDraftJson: string;
  currentDraft: NewsPostDraft;
  enabled: boolean;
}

export function useNewsPostDraft({
  draftKey,
  initialDraft,
  serverDraftJson,
  currentDraft,
  enabled
}: UseNewsPostDraftOptions) {
  const [draftRestored, setDraftRestored] = useState(
    () =>
      initialDraft !== null &&
      JSON.stringify(initialDraft) !== serverDraftJson
  );

  useEffect(() => {
    if (!enabled) return;

    const saveTimeout = setTimeout(() => {
      try {
        if (JSON.stringify(currentDraft) === serverDraftJson) {
          localStorage.removeItem(draftKey);
          setDraftRestored(false);
        } else {
          localStorage.setItem(draftKey, JSON.stringify(currentDraft));
        }
      } catch {}
    }, DRAFT_SAVE_DELAY_MS);

    return () => clearTimeout(saveTimeout);
  }, [currentDraft, draftKey, enabled, serverDraftJson]);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(draftKey);
    } catch {}
  }, [draftKey]);

  const discardDraft = useCallback(() => {
    clearDraft();
    window.location.reload();
  }, [clearDraft]);

  return { draftRestored, clearDraft, discardDraft };
}
