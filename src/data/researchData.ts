// ⚠️ DEMO DATA FOR UI DISPLAY ONLY
// This file contains EMPTY/MINIMAL data structures for UI components
// The AI chatbot does NOT use this data - it fetches real data from the database
// To add real data, use the database tables: researcher_publications, partner_institutions, etc.

export interface ResearchPaper {
  id: string;
  title: string;
  doi: string;
  journal: string;
  quartile: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  year: number;
  authors: string[];
  institutions: string[];
  countries: string[];
  reads: number;
  downloads: number;
  citations: number;
  collaborationScore: number;
  fundingSource: string;
  topic: string;
  topicVector: number[];
  openAccess: boolean;
}

export interface CountryMetrics {
  code: string;
  name: string;
  lat: number;
  lng: number;
  reads: number;
  downloads: number;
  citations: number;
  collaborations: number;
  topPapers: string[];
  partnerUniversities: string[];
  flag: string;
}

export interface Author {
  id: string;
  name: string;
  orcid: string;
  department: string;
  hIndex: number;
  citations: number;
  papers: number;
  collaborators: string[];
}

export interface KPIData {
  globalImpactIndex: number;
  hIndexGrowth: number;
  totalCitations: number;
  totalPapers: number;
  openAccessPercentage: number;
  internationalCollaborations: number;
  q1Publications: number;
  altmetricScore: number;
}

// EMPTY DATA - Replace with real data from database
export const countryMetrics: CountryMetrics[] = [];

export const topAuthors: Author[] = [];

export const kpiData: KPIData = {
  globalImpactIndex: 0,
  hIndexGrowth: 0,
  totalCitations: 0,
  totalPapers: 0,
  openAccessPercentage: 0,
  internationalCollaborations: 0,
  q1Publications: 0,
  altmetricScore: 0
};

export const citationTrends: Array<{ year: number; citations: number; papers: number; hIndex: number }> = [];

export const quartileDistribution: Array<{ quartile: string; count: number; percentage: number }> = [];

export const topicDistribution: Array<{ topic: string; papers: number; citations: number }> = [];

export const collaborationNetwork = {
  nodes: [],
  edges: []
};

export const predictions = {
  citationGrowth: [],
  emergingTopics: [],
  partnerRecommendations: []
};

export const monthlyReadership: Array<{ month: string; reads: number; downloads: number; region: string }> = [];
