'use client';

import css from './NotesPage.module.css';
import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';

import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteForm from '@/components/NoteForm/NoteForm';
import Modal from '@/components/Modal/Modal';

import type { TAGS } from '@/types/note';

import noteService from '@/lib/api';

type NotesClientProps = {
  tag: TAGS | undefined;
};

const NotesClient = ({ tag }: NotesClientProps) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const PER_PAGE = 12;

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setPage(1);
    setSearch(value);
  }, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', { search, page, perPage: PER_PAGE, tag }],
    queryFn: () => noteService.fetchNotes(search, page, PER_PAGE, tag),
    placeholderData: keepPreviousData,
  });

  const handleModalOpen = () => setModalOpen(true);

  const handleModalClose = () => setModalOpen(false);

  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={debouncedSearch} />
        {data?.notes && data.notes.length > 0 && (
          <>
            {totalPages > 1 && (
              <Pagination
                totalPages={totalPages}
                currentPage={page}
                onPageChange={setPage}
              />
            )}
          </>
        )}
        <button className={css.button} onClick={handleModalOpen}>
          Create note +
        </button>
      </header>
      {isLoading && <div>Loading...</div>}
      {isError && <div>There is an error to load notes.</div>}
      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {modalOpen && (
        <Modal onClose={handleModalClose}>
          <NoteForm onCancel={handleModalClose} />
        </Modal>
      )}
    </div>
  );
};

export default NotesClient;
