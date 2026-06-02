'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import noteService from '../../lib/api';
import useNoteDraftStore from '@/lib/store/notStore';

import css from './NoteForm.module.css';
import { useRouter } from 'next/router';

interface NoteFormProps {
  onCancel: () => void;
}

const NoteForm = ({ onCancel }: NoteFormProps) => {
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteDraftStore();
  const router = useRouter();

  const handleFormSubmit = (formData: FormData) => {
    mutation.mutate({
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      tag: formData.get('tag') as string,
    });
  };

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setDraft({ ...draft, [event.target.name]: event.target.value });
  };

  const mutation = useMutation({
    mutationFn: noteService.createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onCancel();
      clearDraft();
      router.push('/notes/filter/all');
    },
  });

  return (
    <form className={css.form} action={handleFormSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          onChange={handleChange}
          id="title"
          type="text"
          name="title"
          className={css.input}
        />
        <span className={css.error} />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          onChange={handleChange}
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
        />
        <span className={css.error} />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          onChange={handleChange}
          id="tag"
          name="tag"
          className={css.select}>
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        <span className={css.error} />
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={onCancel}>
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}>
          Create note
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
