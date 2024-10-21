'use client';

import ActionButton from '@/components/ActionButton/ActionButton';
import ContentPane from '@/components/ContentPane/ContentPane';
import Divider from '@/components/Divider/Divider';
import DropdownList from '@/components/DropdownList/DropdownList';
import TextArea from '@/components/TextArea/TextArea';
import DivisionDocumentService from '@/services/divisionDocumentService';
import DivisionGroupService from '@/services/divisionGroupService';
import i18nService from '@/services/i18nService';
import { DocumentType } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

const FilterDocumentsForm = ({
  groups,
  locale
}: {
  groups: Awaited<ReturnType<typeof DivisionGroupService.getAll>>;
  locale: string;
}) => {
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [type, setType] = useState<string | undefined>(undefined);
  const [groupId, setGroupId] = useState<string | undefined>(undefined);

  const l = i18nService.getLocale(locale);

  const submitSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (type) params.append('type', type);
      if (groupId) params.append('gid', groupId);
      router.push('/documents?' + params.toString());
    },
    [router, query, type, groupId]
  );

  return (
    <ContentPane>
      <h1>{l.search.filter}</h1>
      <Divider />
      <form onSubmit={submitSearch}>
        <div>
          <label>{l.search.query}</label>
          <br />
          <TextArea value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div>
          <label>{l.docs.type}</label>
          <br />
          <DropdownList
            value={type}
            onChange={(e) =>
              setType(e.target.value !== '' ? e.target.value : undefined)
            }
          >
            <option value={''}>{l.search.allTypes}</option>
            {Object.keys(DocumentType).map((type) => (
              <option key={type} value={type}>
                {
                  l.docTypes[
                    DivisionDocumentService.documentTypeKey(
                      type as DocumentType
                    )
                  ]
                }
              </option>
            ))}
          </DropdownList>
        </div>
        <div>
          <label>{l.search.group}</label>
          <br />
          <DropdownList
            onChange={(e) =>
              setGroupId(e.target.value !== '' ? e.target.value : undefined)
            }
          >
            <option value={''}>{l.search.allGroups}</option>
            {groups.map((group) => (
              <option
                key={group!.gammaSuperGroupId}
                value={group!.gammaSuperGroupId}
              >
                {group?.prettyName}
              </option>
            ))}
          </DropdownList>
        </div>
        <br />
        <ActionButton type="submit">{l.search.filterAction}</ActionButton>
      </form>
    </ContentPane>
  );
};

export default FilterDocumentsForm;
