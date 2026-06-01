import {
  dehydrate,
  QueryClient,
  HydrationBoundary,
} from '@tanstack/react-query';

import noteService from '@/lib/api';
import NotesClient from './Notes.client';

import type { TAGS } from '@/types/note';

interface FilterPageProps {
  params: Promise<{ slug: string[] }>;
}

export const generateMetadata = async ({ params }: FilterPageProps) => {
  const { slug } = await params;

  return {
    title: slug[0] === 'all' ? 'All Notes' : `${slug[0]} notes`,
    description:
      slug[0] === 'all' ? 'List of all notes' : `List of ${slug[0]} notes`,

    openGraph: {
      title: slug[0] === 'all' ? 'All Notes' : `${slug[0]} notes`,
      description:
        slug[0] === 'all' ? 'List of all notes' : `List of ${slug[0]} notes`,
    },

    twitter: {
      title: slug[0] === 'all' ? 'All Notes' : `${slug[0]} notes`,
      description:
        slug[0] === 'all' ? 'List of all notes' : `List of ${slug[0]} notes`,
    },
  };
};

const FilterPage = async ({ params }: FilterPageProps) => {
  const queryClient = new QueryClient();

  const { slug } = await params;

  if (slug[0] === 'all') {
    await queryClient.prefetchQuery({
      queryKey: ['notes', { search: '', page: 1, perPage: 12 }],
      queryFn: () => noteService.fetchNotes('', 1, 12),
    });

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient tag={undefined} />
      </HydrationBoundary>
    );
  }

  const selectedTag = slug[0] as TAGS;

  await queryClient.prefetchQuery({
    queryKey: ['notes', { search: '', page: 1, perPage: 12, tag: selectedTag }],
    queryFn: () => noteService.fetchNotes('', 1, 12, selectedTag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={selectedTag} />
    </HydrationBoundary>
  );
};

export default FilterPage;
