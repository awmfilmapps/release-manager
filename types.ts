
export interface Project {
  id: string;
  name: string;
  description: string;
  clientName: string;
  location: string;
  shootDate: string; // New field
  createdAt: string;
  legalText: string; // The specific verbiage for this project's releases
  releases: ModelRelease[];
}

export interface ModelRelease {
  id: string;
  projectId: string;
  modelName: string;
  dateOfBirth: string;
  age: number;
  currentDate: string;
  address: string;
  email: string;
  signature: string; // Base64 image
  isMinor: boolean;
  guardianName?: string;
  guardianSignature?: string;
  createdAt: string;
}

export type ViewState = 'dashboard' | 'project-detail' | 'new-project' | 'edit-project' | 'new-release' | 'view-release';
