export type FamilyTreeRole = 'owner' | 'editor' | 'viewer';

export type FamilyTree = {
  id: number;
  name: string;
  slug: string;
  role: FamilyTreeRole;
  created_at: string;
  updated_at: string;
};

export type CreateFamilyTreeData = {
  name: string;
};
