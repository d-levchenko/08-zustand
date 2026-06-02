import NoteForm from '@/components/NoteForm/NoteForm';
import styles from './CreateNote.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create note',
  description: 'Create note',

  openGraph: {
    title: 'Create note',
    description: 'Create note',
    url: 'https://notehub.app/notes/action/create',
    siteName: 'HoteHub',

    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1244,
        height: 829,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Create note',
    description: 'Create note',
  },
};

interface CreateNotePageProps {
  handleFormCancel: () => void;
}

const CreateNotePage = ({ handleFormCancel }: CreateNotePageProps) => {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Create note</h1>
        <NoteForm onCancel={handleFormCancel} />
      </div>
    </main>
  );
};

export default CreateNotePage;
