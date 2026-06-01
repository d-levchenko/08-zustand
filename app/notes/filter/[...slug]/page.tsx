import {
  dehydrate,
  QueryClient,
  HydrationBoundary,
} from '@tanstack/react-query';

import noteService from '@/lib/api';
import NotesClient from './Notes.client';

interface FilterPageProps {
  params: Promise<{ slug: string[] }>;
}

const FilterPage = async ({ params }: FilterPageProps) => {
  type TAGS = 'Work' | 'Personal' | 'Todo' | 'Shopping' | 'Meeting';
  const queryClient = new QueryClient();

  const { slug } = await params;

  await queryClient.prefetchQuery({
    queryKey: ['notes', slug?.[0] ?? 'all'],
    queryFn: () => noteService.fetchNotes('', 1, 12, slug?.[0] as TAGS),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  );
};

export default FilterPage;
