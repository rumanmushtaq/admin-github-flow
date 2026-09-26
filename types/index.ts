export interface GitHubRepo {
  githubId: number;
  name: string;
  fullName: string;
  githubUrl: string;
  homepage: string | null;
  description: string;
  language: string;
  stars: number;
  updatedAt: string;
  topics: string[];
  fork: boolean;
  imported: boolean;
}

export interface Project {
  _id: string;
  githubId: number;
  name: string;
  fullName: string;
  githubUrl: string;
  homepage: string | null;
  title: string;
  description: string;
  techStack: string[];
  category: string;
  thumbnail: string | null;
  featured: boolean;
  published: boolean;
  order: number;
  githubStars: number;
  language: string;
  createdAt: string;
  updatedAt: string;
}
