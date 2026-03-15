import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-cicd-guide',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cicd-guide.component.html',
  styleUrls: ['./cicd-guide.component.css']
})
export class CicdGuideComponent {
  ts = inject(TranslationService);
  activeTab = signal('github');
  copied = signal<string | null>(null);

  steps = computed(() => [
    { title: this.ts.t('cicd.getApiKey'), description: this.ts.t('cicd.getApiKeyDesc'), icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { title: this.ts.t('cicd.addToCicd'), description: this.ts.t('cicd.addToCicdDesc'), icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
    { title: this.ts.t('cicd.configSecrets'), description: this.ts.t('cicd.configSecretsDesc'), icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { title: this.ts.t('cicd.monitorResults'), description: this.ts.t('cicd.monitorResultsDesc'), icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  ]);

  platformTabs = computed(() => [
    {
      id: 'github', label: 'GitHub Actions',
      icon: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22',
      note: this.ts.t('cicd.ghNote'),
      config: `name: Security Scan

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 0 * * 0'  # Weekly scan

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Run ASVS Security Scan
      uses: asvs-security/scan-action@v1
      with:
        api-key: \${{ secrets.ASVS_API_KEY }}
        fail-on-critical: true
        
    - name: Upload Results
      uses: actions/upload-artifact@v3
      with:
        name: security-report
        path: reports/`
    },
    {
      id: 'gitlab', label: 'GitLab CI',
      icon: 'M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 01-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 014.82 2a.43.43 0 01.58 0 .42.42 0 01.11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0118.6 2a.43.43 0 01.58 0 .42.42 0 01.11.18l2.44 7.51L23 13.45a.84.84 0 01-.35.94z',
      note: this.ts.t('cicd.glNote'),
      config: `stages:
  - security

security_scan:
  stage: security
  image: asvs-security/scanner:latest
  script:
    - asvs-scan --api-key ASVS_API_KEY --output reports/
  artifacts:
    reports:
      sast: reports/gl-sast-report.json
    paths:
      - reports/
  only:
    - main
    - develop
    - merge_requests`
    },
    {
      id: 'circleci', label: 'CircleCI',
      icon: 'M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-6a4 4 0 100-8 4 4 0 000 8z',
      note: this.ts.t('cicd.circleNote'),
      config: `version: 2.1

orbs:
  asvs-security: asvs-security/scan@1.0.0

workflows:
  security-scan:
    jobs:
      - asvs-security/scan:
          api-key: \${ASVS_API_KEY}
          fail-on-critical: true`
    },
  ]);

  bestPractices = computed(() => [
    { title: this.ts.t('cicd.scanOnPR'), description: this.ts.t('cicd.scanOnPRDesc'), severity: 'Critical' },
    { title: this.ts.t('cicd.failOnCritical'), description: this.ts.t('cicd.failOnCriticalDesc'), severity: 'High' },
    { title: this.ts.t('cicd.weeklyScans'), description: this.ts.t('cicd.weeklyScansDesc'), severity: 'Medium' },
    { title: this.ts.t('cicd.trackCompliance'), description: this.ts.t('cicd.trackComplianceDesc'), severity: 'Medium' },
  ]);

  envVars = computed(() => [
    { name: 'ASVS_API_KEY', description: this.ts.t('cicd.apiKeyDesc'), required: true },
    { name: 'ASVS_FAIL_ON_CRITICAL', description: this.ts.t('cicd.failOnCriticalEnv'), required: false },
    { name: 'ASVS_OUTPUT_FORMAT', description: this.ts.t('cicd.outputFormat'), required: false },
  ]);

  copy(id: string, text: string) {
    navigator.clipboard.writeText(text);
    this.copied.set(id);
    setTimeout(() => this.copied.set(null), 2000);
  }
}
