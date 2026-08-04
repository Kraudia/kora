import { User } from '@/features/auth/api/authApi';
import { apiRequest, initializeCsrf } from '@/shared/api/apiClient';
import { CreateFamilyTreeData, FamilyTree } from '../types/familyTree';

type FamilyTreesResponse = {
  family_trees: FamilyTree[];
};

type FamilyTreeResponse = {
  family_tree: FamilyTree;
};

type UserResponse = {
  user: User;
};

export async function getFamilyTrees(): Promise<FamilyTree[]> {
  const response = await apiRequest<FamilyTreesResponse>('/api/family-trees');

  return response.family_trees;
}

export async function getFamilyTree(slug: string): Promise<FamilyTree> {
  const response = await apiRequest<FamilyTreeResponse>(
    `/api/family-trees/${encodeURIComponent(slug)}`,
  );

  return response.family_tree;
}

export async function createFamilyTree(data: CreateFamilyTreeData): Promise<FamilyTree> {
  await initializeCsrf();

  const response = await apiRequest<FamilyTreeResponse>('/api/family-trees', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  return response.family_tree;
}

export async function skipOnboarding(): Promise<User> {
  await initializeCsrf();

  const response = await apiRequest<UserResponse>('/api/onboarding/skip', {
    method: 'POST',
  });

  return response.user;
}
