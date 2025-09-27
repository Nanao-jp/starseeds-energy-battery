export type ProjectStatus = "operational" | "construction" | "planning";

export interface Project {
  id: string;
  name: string;
  region: string;
  capacityMW: number;
  energyMWh: number;
  status: ProjectStatus;
  startDate?: string;
  plannedDate?: string;
  description: string;
  photos: string[];
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: 'press-release' | 'event' | 'update';
  summary: string;
  content: string; // Markdown content
}
