import { useQuery } from '@tanstack/react-query';
import { getFamilyTrees } from '../api/familyTreeApi';
import { familyTreeQueryKeys } from './familyTreeQueryKeys';

export function useFamilyTrees() {
  return useQuery({
    queryKey: familyTreeQueryKeys.list(),
    queryFn: getFamilyTrees,
  });
}
