import { useQuery } from '@tanstack/react-query';
import { getFamilyTree } from '../api/familyTreeApi';
import { familyTreeQueryKeys } from './familyTreeQueryKeys';

export function useFamilyTree(slug: string) {
  return useQuery({
    queryKey: familyTreeQueryKeys.detail(slug),
    queryFn: () => getFamilyTree(slug),
    enabled: slug.length > 0,
  });
}
