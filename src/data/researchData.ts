// Realistic synthetic research data for UDSM Global Research Intelligence Platform

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

// Global Impact Metrics by Country
export const countryMetrics: CountryMetrics[] = [
  {
    code: 'US',
    name: 'United States',
    lat: 37.0902,
    lng: -95.7129,
    reads: 45230,
    downloads: 12450,
    citations: 8920,
    collaborations: 156,
    topPapers: ['Climate Change Impact on African Agriculture', 'Machine Learning for Malaria Detection'],
    partnerUniversities: ['MIT', 'Stanford University', 'Johns Hopkins University'],
    flag: '🇺🇸'
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    lat: 55.3781,
    lng: -3.4360,
    reads: 38450,
    downloads: 9870,
    citations: 7230,
    collaborations: 142,
    topPapers: ['Sustainable Water Management in Tanzania', 'Public Health Infrastructure'],
    partnerUniversities: ['Oxford University', 'Cambridge University', 'Imperial College London'],
    flag: '🇬🇧'
  },
  {
    code: 'DE',
    name: 'Germany',
    lat: 51.1657,
    lng: 10.4515,
    reads: 28760,
    downloads: 7650,
    citations: 5430,
    collaborations: 98,
    topPapers: ['Renewable Energy Systems for East Africa', 'Advanced Materials Research'],
    partnerUniversities: ['TU Munich', 'Humboldt University', 'Max Planck Institute'],
    flag: '🇩🇪'
  },
  {
    code: 'CN',
    name: 'China',
    lat: 35.8617,
    lng: 104.1954,
    reads: 52340,
    downloads: 14230,
    citations: 6780,
    collaborations: 87,
    topPapers: ['Agricultural Innovation Technologies', 'Infrastructure Development'],
    partnerUniversities: ['Tsinghua University', 'Peking University', 'Fudan University'],
    flag: '🇨🇳'
  },
  {
    code: 'IN',
    name: 'India',
    lat: 20.5937,
    lng: 78.9629,
    reads: 34120,
    downloads: 8970,
    citations: 4560,
    collaborations: 76,
    topPapers: ['Tropical Disease Research', 'Agricultural Sustainability'],
    partnerUniversities: ['IIT Delhi', 'Indian Institute of Science', 'JNU'],
    flag: '🇮🇳'
  },
  {
    code: 'ZA',
    name: 'South Africa',
    lat: -30.5595,
    lng: 22.9375,
    reads: 29870,
    downloads: 7890,
    citations: 5670,
    collaborations: 134,
    topPapers: ['African Continental Research Collaboration', 'Mining and Environment'],
    partnerUniversities: ['University of Cape Town', 'Wits University', 'Stellenbosch'],
    flag: '🇿🇦'
  },
  {
    code: 'KE',
    name: 'Kenya',
    lat: -0.0236,
    lng: 37.9062,
    reads: 24560,
    downloads: 6540,
    citations: 3890,
    collaborations: 112,
    topPapers: ['East African Economic Integration', 'Wildlife Conservation'],
    partnerUniversities: ['University of Nairobi', 'JKUAT', 'Strathmore University'],
    flag: '🇰🇪'
  },
  {
    code: 'JP',
    name: 'Japan',
    lat: 36.2048,
    lng: 138.2529,
    reads: 18970,
    downloads: 4560,
    citations: 3450,
    collaborations: 45,
    topPapers: ['Technology Transfer Programs', 'Marine Biology'],
    partnerUniversities: ['University of Tokyo', 'Kyoto University', 'Osaka University'],
    flag: '🇯🇵'
  },
  {
    code: 'AU',
    name: 'Australia',
    lat: -25.2744,
    lng: 133.7751,
    reads: 21340,
    downloads: 5670,
    citations: 4120,
    collaborations: 67,
    topPapers: ['Climate Adaptation Strategies', 'Mining Research'],
    partnerUniversities: ['University of Melbourne', 'ANU', 'University of Sydney'],
    flag: '🇦🇺'
  },
  {
    code: 'BR',
    name: 'Brazil',
    lat: -14.2350,
    lng: -51.9253,
    reads: 15670,
    downloads: 4230,
    citations: 2890,
    collaborations: 34,
    topPapers: ['Tropical Forestry Research', 'Biodiversity Studies'],
    partnerUniversities: ['USP', 'UNICAMP', 'Federal University of Rio'],
    flag: '🇧🇷'
  },
  {
    code: 'NG',
    name: 'Nigeria',
    lat: 9.0820,
    lng: 8.6753,
    reads: 19870,
    downloads: 5120,
    citations: 2670,
    collaborations: 89,
    topPapers: ['African Higher Education', 'Oil and Gas Research'],
    partnerUniversities: ['University of Lagos', 'University of Ibadan', 'ABU Zaria'],
    flag: '🇳🇬'
  },
  {
    code: 'SE',
    name: 'Sweden',
    lat: 60.1282,
    lng: 18.6435,
    reads: 14560,
    downloads: 3890,
    citations: 4230,
    collaborations: 78,
    topPapers: ['Sustainable Development Goals Research', 'Gender Studies'],
    partnerUniversities: ['Uppsala University', 'Karolinska Institute', 'KTH'],
    flag: '🇸🇪'
  },
  {
    code: 'NL',
    name: 'Netherlands',
    lat: 52.1326,
    lng: 5.2913,
    reads: 16780,
    downloads: 4560,
    citations: 5120,
    collaborations: 82,
    topPapers: ['Water Management', 'Agricultural Technology'],
    partnerUniversities: ['Wageningen University', 'TU Delft', 'University of Amsterdam'],
    flag: '🇳🇱'
  },
  {
    code: 'CA',
    name: 'Canada',
    lat: 56.1304,
    lng: -106.3468,
    reads: 22340,
    downloads: 6120,
    citations: 4780,
    collaborations: 56,
    topPapers: ['Mining and Sustainability', 'Public Policy Research'],
    partnerUniversities: ['University of Toronto', 'McGill University', 'UBC'],
    flag: '🇨🇦'
  },
  {
    code: 'FR',
    name: 'France',
    lat: 46.2276,
    lng: 2.2137,
    reads: 17890,
    downloads: 4780,
    citations: 3670,
    collaborations: 54,
    topPapers: ['Francophone African Studies', 'Urban Development'],
    partnerUniversities: ['Sorbonne University', 'École Polytechnique', 'CNRS'],
    flag: '🇫🇷'
  }
];

// Top Authors at UDSM
export const topAuthors: Author[] = [
  {
    id: 'auth-001',
    name: 'Prof. Amani Mwangi',
    orcid: '0000-0001-2345-6789',
    department: 'College of Engineering',
    hIndex: 34,
    citations: 4567,
    papers: 89,
    collaborators: ['Dr. John Smith (MIT)', 'Prof. Liu Wei (Tsinghua)', 'Dr. Sarah Johnson (Oxford)']
  },
  {
    id: 'auth-002',
    name: 'Dr. Fatima Hassan',
    orcid: '0000-0002-3456-7890',
    department: 'School of Medicine',
    hIndex: 28,
    citations: 3234,
    papers: 67,
    collaborators: ['Prof. James Brown (Harvard)', 'Dr. Priya Patel (IISc)']
  },
  {
    id: 'auth-003',
    name: 'Prof. Joseph Kimathi',
    orcid: '0000-0003-4567-8901',
    department: 'College of Natural Sciences',
    hIndex: 31,
    citations: 3890,
    papers: 78,
    collaborators: ['Dr. Anna Schmidt (Max Planck)', 'Prof. Yuki Tanaka (Tokyo)']
  },
  {
    id: 'auth-004',
    name: 'Dr. Grace Nyerere',
    orcid: '0000-0004-5678-9012',
    department: 'School of Economics',
    hIndex: 25,
    citations: 2456,
    papers: 52,
    collaborators: ['Prof. Michael Chen (Stanford)', 'Dr. Emma Wilson (LSE)']
  },
  {
    id: 'auth-005',
    name: 'Prof. Samuel Ochieng',
    orcid: '0000-0005-6789-0123',
    department: 'Institute of Marine Sciences',
    hIndex: 29,
    citations: 3123,
    papers: 61,
    collaborators: ['Dr. Henrik Larsen (Copenhagen)', 'Prof. Maria Santos (Lisbon)']
  }
];

// KPI Summary Data
export const kpiData: KPIData = {
  globalImpactIndex: 78.4,
  hIndexGrowth: 12.5,
  totalCitations: 156789,
  totalPapers: 4523,
  openAccessPercentage: 67.8,
  internationalCollaborations: 892,
  q1Publications: 423,
  altmetricScore: 8934
};

// Citation Trend Data (Last 10 years)
export const citationTrends = [
  { year: 2015, citations: 8234, papers: 312, hIndex: 42 },
  { year: 2016, citations: 9456, papers: 345, hIndex: 44 },
  { year: 2017, citations: 11234, papers: 378, hIndex: 47 },
  { year: 2018, citations: 13567, papers: 412, hIndex: 51 },
  { year: 2019, citations: 15890, papers: 445, hIndex: 54 },
  { year: 2020, citations: 18234, papers: 489, hIndex: 58 },
  { year: 2021, citations: 21567, papers: 523, hIndex: 62 },
  { year: 2022, citations: 24890, papers: 567, hIndex: 67 },
  { year: 2023, citations: 28234, papers: 612, hIndex: 72 },
  { year: 2024, citations: 32567, papers: 678, hIndex: 78 }
];

// Journal Quartile Distribution
export const quartileDistribution = [
  { quartile: 'Q1', count: 423, percentage: 28 },
  { quartile: 'Q2', count: 567, percentage: 37 },
  { quartile: 'Q3', count: 389, percentage: 25 },
  { quartile: 'Q4', count: 156, percentage: 10 }
];

// Research Topic Distribution
export const topicDistribution = [
  { topic: 'Health Sciences', papers: 678, citations: 23456 },
  { topic: 'Engineering', papers: 523, citations: 18234 },
  { topic: 'Environmental Science', papers: 456, citations: 15678 },
  { topic: 'Agriculture', papers: 389, citations: 12345 },
  { topic: 'Social Sciences', papers: 345, citations: 9876 },
  { topic: 'Natural Sciences', papers: 312, citations: 11234 },
  { topic: 'Economics', papers: 278, citations: 8765 },
  { topic: 'Computer Science', papers: 245, citations: 9234 }
];

// Collaboration Network Data
export const collaborationNetwork = {
  nodes: [
    { id: 'UDSM', label: 'UDSM', type: 'institution', size: 50 },
    { id: 'MIT', label: 'MIT', type: 'partner', size: 35 },
    { id: 'Oxford', label: 'Oxford', type: 'partner', size: 32 },
    { id: 'Tsinghua', label: 'Tsinghua', type: 'partner', size: 28 },
    { id: 'UCT', label: 'Univ. Cape Town', type: 'partner', size: 30 },
    { id: 'UoN', label: 'Univ. Nairobi', type: 'partner', size: 28 },
    { id: 'WHO', label: 'WHO', type: 'funding', size: 25 },
    { id: 'WorldBank', label: 'World Bank', type: 'funding', size: 24 },
    { id: 'Gates', label: 'Gates Foundation', type: 'funding', size: 26 }
  ],
  edges: [
    { source: 'UDSM', target: 'MIT', weight: 45 },
    { source: 'UDSM', target: 'Oxford', weight: 52 },
    { source: 'UDSM', target: 'Tsinghua', weight: 38 },
    { source: 'UDSM', target: 'UCT', weight: 67 },
    { source: 'UDSM', target: 'UoN', weight: 78 },
    { source: 'UDSM', target: 'WHO', weight: 34 },
    { source: 'UDSM', target: 'WorldBank', weight: 42 },
    { source: 'UDSM', target: 'Gates', weight: 29 }
  ]
};

// Predictive Analytics Data
export const predictions = {
  citationGrowth: [
    { year: 2025, predicted: 38000, lower: 35000, upper: 41000 },
    { year: 2026, predicted: 45000, lower: 40000, upper: 50000 },
    { year: 2027, predicted: 54000, lower: 47000, upper: 61000 },
    { year: 2028, predicted: 65000, lower: 55000, upper: 75000 },
    { year: 2029, predicted: 78000, lower: 65000, upper: 91000 }
  ],
  emergingTopics: [
    { topic: 'AI in Healthcare', growthRate: 45, confidence: 0.89 },
    { topic: 'Climate Adaptation', growthRate: 38, confidence: 0.92 },
    { topic: 'Renewable Energy', growthRate: 35, confidence: 0.87 },
    { topic: 'Digital Agriculture', growthRate: 32, confidence: 0.84 },
    { topic: 'Urban Sustainability', growthRate: 28, confidence: 0.81 }
  ],
  partnerRecommendations: [
    { institution: 'NUS Singapore', score: 0.92, reason: 'High alignment in Health Sciences' },
    { institution: 'ETH Zurich', score: 0.88, reason: 'Strong Engineering synergy' },
    { institution: 'University of Tokyo', score: 0.85, reason: 'Emerging Marine Sciences collaboration' }
  ]
};

// Monthly Readership Data for Current Year
export const monthlyReadership = [
  { month: 'Jan', reads: 12450, downloads: 3420, region: 'Global' },
  { month: 'Feb', reads: 14230, downloads: 3890, region: 'Global' },
  { month: 'Mar', reads: 15670, downloads: 4120, region: 'Global' },
  { month: 'Apr', reads: 13890, downloads: 3670, region: 'Global' },
  { month: 'May', reads: 16780, downloads: 4560, region: 'Global' },
  { month: 'Jun', reads: 18230, downloads: 4890, region: 'Global' },
  { month: 'Jul', reads: 17450, downloads: 4670, region: 'Global' },
  { month: 'Aug', reads: 19120, downloads: 5120, region: 'Global' },
  { month: 'Sep', reads: 21340, downloads: 5670, region: 'Global' },
  { month: 'Oct', reads: 23560, downloads: 6230, region: 'Global' },
  { month: 'Nov', reads: 22340, downloads: 5890, region: 'Global' },
  { month: 'Dec', reads: 24780, downloads: 6540, region: 'Global' }
];
