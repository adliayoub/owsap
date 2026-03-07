export interface ASVSRequirement {
  Area: string;
  '#': string;
  'ASVS Level': number;
  CWE: number | string;
  NIST: string;
  'Verification Requirement': string;
  Valid: string;
  'Source Code Reference': string;
  Comment: string;
  'Tool Used': string;
}

export interface ASVSResult {
  'Security Category': string;
  'Valid criteria': number;
  'Total criteria': number;
  'Validity Percentage': number;
  'ASVS Level Acquired': string;
}

export interface ASVSData {
  Architecture: ASVSRequirement[];
  Authentication: ASVSRequirement[];
  'ASVS Results': ASVSResult[];
  [key: string]: ASVSRequirement[] | ASVSResult[];
}

export interface Vulnerability {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  category: string;
  description: string;
  filePath?: string;
  lineNumber?: number;
  remediation?: string;
}

export interface ScanResult {
  id: string;
  repository: string;
  url: string;
  date: string;
  status: 'Completed' | 'Failed' | 'In Progress';
  filesScanned: number;
  linesOfCode: number;
  vulnerabilities: Vulnerability[];
  secretsFound: number;
  outdatedDeps: number;
  asvsCoverage: number;
}

export interface RequirementStatus {
  id: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Not Applicable';
  notes?: string;
}

export interface User {
  email: string;
  name: string;
  role: string;
}

export interface ScanHistoryItem {
  id: string;
  repository: string;
  url: string;
  date: string;
  status: 'Completed' | 'Failed' | 'In Progress';
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  asvsCoverage: number;
}
