import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Vulnerability {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  category: string;
  description: string;
  filePath?: string;
  remediation?: string;
}

interface ScanStage {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed';
  icon: string;
}

@Component({
  selector: 'app-github-scanner',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './github-scanner.component.html',
  styleUrls: ['./github-scanner.component.css']
})
export class GithubScannerComponent {
  repoUrl = '';
  isScanning = signal(false);
  scanProgress = signal(0);
  scanComplete = signal(false);
  selectedVuln = signal<Vulnerability | null>(null);
  activeTab = signal('vulnerabilities');

  stages = signal<ScanStage[]>([
    { id: 'clone', name: 'Cloning', status: 'pending', icon: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22' },
    { id: 'static', name: 'Static Analysis', status: 'pending', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
    { id: 'dependency', name: 'Dependencies', status: 'pending', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'secrets', name: 'Secrets', status: 'pending', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { id: 'config', name: 'Config', status: 'pending', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { id: 'ai', name: 'AI Analysis', status: 'pending', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
  ]);

  mockVulnerabilities: Vulnerability[] = [
    { id: 'VULN-001', title: 'SQL Injection Vulnerability', severity: 'Critical', category: 'Injection', description: 'User input is directly concatenated into SQL queries without parameterization.', filePath: 'src/database/queries.js:45', remediation: 'Use parameterized queries or prepared statements.' },
    { id: 'VULN-002', title: 'Hardcoded API Key', severity: 'Critical', category: 'Secrets Management', description: 'API key found hardcoded in source code.', filePath: 'config/api.js:12', remediation: 'Use environment variables or a secure secrets management system.' },
    { id: 'VULN-003', title: 'Insecure Cookie Configuration', severity: 'High', category: 'Session Management', description: 'Cookies are set without Secure and HttpOnly flags.', filePath: 'src/auth/session.js:28', remediation: 'Set Secure, HttpOnly, and SameSite flags on all cookies.' },
    { id: 'VULN-004', title: 'Outdated Dependency: lodash', severity: 'High', category: 'Dependencies', description: 'lodash version 4.17.15 has known vulnerabilities.', remediation: 'Update lodash to the latest version.' },
    { id: 'VULN-005', title: 'Missing Content Security Policy', severity: 'Medium', category: 'Headers', description: 'No Content-Security-Policy header detected.', remediation: 'Implement a strict Content Security Policy header.' },
  ];

  scanStats = [
    { label: 'Files Scanned', value: 156, icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4', color: 'text-blue-500' },
    { label: 'Lines of Code', value: '12,450', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'text-purple-500' },
    { label: 'Vulnerabilities', value: 5, icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', color: 'text-red-500' },
    { label: 'Secrets Found', value: 2, icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', color: 'text-orange-500' },
    { label: 'Outdated Deps', value: 5, icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', color: 'text-yellow-500' },
  ];

  tabs = [
    { id: 'vulnerabilities', label: 'Vulnerabilities', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    { id: 'mapping', label: 'ASVS Mapping', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { id: 'export', label: 'Export', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' },
  ];

  asvsMapping = [
    { req: '5.3.1 - SQL Injection', category: 'Input Validation', count: 1 },
    { req: '2.10.1 - No Hardcoded Secrets', category: 'Authentication', count: 1 },
    { req: '3.4.1 - Secure Cookies', category: 'Session Management', count: 1 },
    { req: '14.2.1 - Dependency Management', category: 'Configuration', count: 1 },
    { req: '14.4.1 - Security Headers', category: 'Configuration', count: 1 },
  ];

  exportFormats = [
    { format: 'PDF Report', desc: 'Detailed PDF with findings', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { format: 'JSON', desc: 'Machine-readable JSON', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
    { format: 'SARIF', desc: 'Standard SARIF format', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  ];

  getSeverityClass(s: string): string {
    return { Critical: 'bg-red-500', High: 'bg-orange-500', Medium: 'bg-yellow-500', Low: 'bg-blue-500' }[s] ?? 'bg-gray-500';
  }

  async startScan() {
    if (!this.repoUrl.trim()) return;
    this.isScanning.set(true);
    this.scanProgress.set(0);
    this.scanComplete.set(false);
    this.stages.update(s => s.map(x => ({ ...x, status: 'pending' as const })));

    for (let i = 0; i < this.stages().length; i++) {
      this.stages.update(s => s.map((x, idx) =>
        idx === i ? { ...x, status: 'running' as const } : idx < i ? { ...x, status: 'completed' as const } : x
      ));
      await new Promise(r => setTimeout(r, 1200));
      this.scanProgress.set(((i + 1) / this.stages().length) * 100);
      this.stages.update(s => s.map((x, idx) => idx === i ? { ...x, status: 'completed' as const } : x));
    }

    this.isScanning.set(false);
    this.scanComplete.set(true);
  }
}
