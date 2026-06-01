import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import noteService from '@/lib/api';
import NoteDetails from './NoteDetails.client';

type NoteDetailsProps = {
  params: Promise<{ id: string }>;
};

export const generateMetadata = async ({ params }: NoteDetailsProps) => {
  const { id } = await params;

  return {
    title: `Note ${id}`,
    description: `Note ${id} details`,

    openGraph: {
      title: `Note ${id}`,
      description: `Note ${id} details`,
    },

    twitter: {
      title: `Note ${id}`,
      description: `Note ${id} details`,
    },
  };
};

const NotePageDetails = async ({ params }: NoteDetailsProps) => {
  const queryClient = new QueryClient();

  const { id } = await params;

  await queryClient.prefetchQuery({
    queryKey: ['notes', id],
    queryFn: () => noteService.fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetails id={id} />
    </HydrationBoundary>
  );
};

export default NotePageDetails;
