export const familyTreeQueryKeys = {
  all: ['family-trees'] as const,
  list: () => [...familyTreeQueryKeys.all, 'list'] as const,
  detail: (slug: string) => [...familyTreeQueryKeys.all, 'detail', slug] as const,
};
