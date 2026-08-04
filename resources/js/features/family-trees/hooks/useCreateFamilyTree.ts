import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFamilyTree } from '../api/familyTreeApi';
import { familyTreeQueryKeys } from './familyTreeQueryKeys';

export function useCreateFamilyTree() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFamilyTree,
    onSuccess: (familyTree) => {
      queryClient.setQueryData(familyTreeQueryKeys.detail(familyTree.slug), familyTree);
      void queryClient.invalidateQueries({ queryKey: familyTreeQueryKeys.list() });
    },
  });
}
